import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import session from 'express-session'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { RegisteredUsers, StudentWithQuestion, DraftOrder, Order } from './data'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import { keycloak } from './secrets'
import { rmSync } from 'fs'
import { updateLanguageServiceSourceFile } from 'typescript'

// set up Mongo
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let students: Collection
let customers: Collection
let orders: Collection
let users: Collection
// let operators: Collection
let possibleIngredients: Collection
let studentId: number = undefined
let queue: StudentWithQuestion[]

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

// app routes
app.get("/api/possible-ingredients", async (req, res) => {
  res.status(200).json(await possibleIngredients.find().toArray())
})

app.get("/api/user", async (req, res) => {
  res.status(200).json(req.user || {})
})

app.get("/api/user/:email", async (req, res) => {
  let email = req.params.email
  let student = await students.findOne({ email })
  if(student == null) {
    let staff = await users.findOne({ email })
    if(staff != null) {
      return res.status(200).json(staff)
    }
    res.status(404).json({ email })
    return
  }
  res.status(200).json(student)
})

app.get("/api/orders", async (req, res) => {
  res.status(200).json(await orders.find({ state: { $ne: "draft" }}).toArray())
})

app.get("/api/student/:mongoId", async (req, res) => {
  const _id = new ObjectId(req.params.mongoId)
  // using the _id field to query in mongoDB
  const student = await students.findOne({ _id: _id })
  if (student == null) {
    res.status(404).json({ _id })
    return
  }
  // student.orders = await orders.find({ customerId: _id, state: { $ne: "draft" } }).toArray()
  // student. = await orders.find({ customerId: _id, state: { $ne: "draft" } }).toArray()
  res.status(200).json(student)
})

app.get("/api/staff/:staffId", async (req, res) => {
  const _id = new ObjectId(req.params.staffId)
  const staff = await users.findOne({ _id })
  if (staff == null) {
    res.status(404).json({ _id })
    return
  }
  res.status(200).json(staff)
})

app.get("/api/queue", async (req, res) => {
  res.status(200).json(await students.find().toArray())
})

app.get("/api/student/:studentId/draft-question", async (req, res) => {
  const studentId = req.params.studentId
  // TODO: validate customerId
  const draftOrder = await orders.findOne({ state: "draft", studentId })
  res.status(200).json(draftOrder || { studentId, ingredientIds: [] })
})

app.put("/api/staff/mark", async (req, res) => {
  const email = req.body.email
  const student = await students.findOne({ email })
  const currPosition = student.position
  const result = await students.updateOne(
    {
     email: email
    },
    {
      $unset: {
        question: "",
        position: ""
      }
    }
  )
  await students.updateMany(
    {
      position: {$gte: currPosition}
    },
    {
      $inc: { position: -1 }
    }
  )
  if(result.modifiedCount == 0) {
    res.status(404).json({ email })
  }
  res.status(200).json({status: "ok"})
})

app.put("/api/student/:studentId/draft-question", async (req, res) => {
    const student: StudentWithQuestion = req.body
    const currPosition = await students.countDocuments({question: { $exists: true }})
    const result = await students.updateOne(
      {
        _id: new ObjectId(req.params.studentId),
      },
      {
        $set: {
          question: student.question,
          position: currPosition + 1
        }
      },
      {
        upsert: true
      }
    )
    res.status(200).json({ status: "ok" })
  })

// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  users = db.collection('users')
  // operators = db.collection('operators')
  orders = db.collection('orders')
  customers = db.collection('customers')
  possibleIngredients = db.collection('possibleIngredients')
  students = db.collection('students')

  Issuer.discover("http://127.0.0.1:8081/auth/realms/office_hour_students/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const email = userInfo.email
        const staff = await users.findOne({ email })
        console.log(staff)
        if (staff != null) {
          userInfo.roles = ["staff"]
        } else {
          
          await students.updateOne(
            { email },
            {
              $set: {
                name: userInfo.name,
              },
            },
            { upsert: true }
          )
          userInfo.roles = ["student"]
        }
        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login",
        passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
        (req, res) => {
          res.redirect(`http://127.0.0.1:8096/redirect`)
        }
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        successRedirect: `http://127.0.0.1:8096/redirect`,
        failureRedirect: "/api/login",
      })
    )    
  })

  // start server
  app.listen(port, () => {
    console.log(`OH Queue server listening on port ${port}`)
  })
})
