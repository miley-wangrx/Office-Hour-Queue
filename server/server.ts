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

// set up Mongo
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db
let students: Collection
let customers: Collection
let orders: Collection
let staffs: Collection
// let operators: Collection
let possibleIngredients: Collection
let studentId: number = undefined

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

app.get("/api/staff/:staffName", async (req, res) => {
  const _name = req.params.staffName
  // findOne: tell mango that only give me one, since there's only one draft order
  // hint: draft order is like a shopping cart
  const staff = await staffs.findOne({ _name })
  if (staffs == null) {
    res.status(404).json({ _name })
    return
  }
  // TODO: queue
  // operator.orders = await orders.find({ operatorId: _id }).toArray()
  res.status(200).json(staff)
})

app.get("/api/student/:studentId/draft-question", async (req, res) => {
  const studentId = req.params.studentId
  // TODO: validate customerId
  const draftOrder = await orders.findOne({ state: "draft", studentId })
  res.status(200).json(draftOrder || { studentId, ingredientIds: [] })
})

app.put("/api/student/:studentId/draft-question", async (req, res) => {
    const student: StudentWithQuestion = req.body
    const result = await students.updateOne(
      {
        _id: new ObjectId(req.params.studentId),
      },
      {
        $set: {
          question: student.question
        }
      },
      {
        upsert: true
      }
    )
    res.status(200).json({ status: "ok" })
  })

app.post("/api/student/:studentId/submit-draft-question", async (req, res) => {
  const result = await students.updateOne(
    {
      studentId: req.params.studentId,
    },
    {
      $set: {
        // state: "queued",
      }
    }
  )
  if (result.modifiedCount === 0) {
    res.status(400).json({ error: "no draft question" })
    return
  }
  res.status(200).json({ status: "ok" })
})

app.put("/api/order/:orderId", async (req, res) => {
  const order: Order = req.body
  // TODO: validate order object
  const condition: any = {
    _id: new ObjectId(req.params.orderId),
    state: { 
      $in: [
        // because PUT is idempotent, ok to call PUT twice in a row with the existing state
        order.state
      ]
    },
  }
  switch (order.state) {
    case "blending":
      condition.state.$in.push("queued")
      // can only go to blending state if no operator assigned (or is the current user, due to idempotency)
      condition.$or = [{ operatorId: { $exists: false }}, { operatorId: order.operatorId }]
      break
    case "done":
      condition.state.$in.push("blending")
      condition.operatorId = order.operatorId
      break
    default:
      // invalid state
      res.status(400).json({ error: "invalid state" })
      return
  }
  
  const result = await orders.updateOne(
    condition,
    {
      $set: {
        state: order.state,
        operatorId: order.operatorId,
      }
    }
  )

  if (result.matchedCount === 0) {
    res.status(400).json({ error: "orderId does not exist or state change not allowed" })
    return
  }
  res.status(200).json({ status: "ok" })
})

// connect to Mongo
client.connect().then(() => {
  console.log('Connected successfully to MongoDB')
  db = client.db("test")
  staffs = db.collection('staffs')
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
        await students.updateOne(
          { email },
          {
            $set: {
              name: userInfo.name
            }
          },
          { upsert: true }
        )
        let student = await students.findOne({ email })
        studentId = student.studentId
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
    console.log(`Smoothie server listening on port ${port}`)
  })
})
