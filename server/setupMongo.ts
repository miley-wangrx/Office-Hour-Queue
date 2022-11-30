import { MongoClient, ObjectId } from 'mongodb'
import { StudentWithQuestion, Operator, Customer, Ingredient, RegisteredUsers } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

// const operators: Operator[] = [
//   {
//     _id: "jim",
//     name: "Jim",
//   },
//   {
//     _id: "mary",
//     name: "Mary",
//   },
// ]

// const customers: Customer[] = [
//   {
//     _id: "alice",
//     name: "Alice",
//   },
//   {
//     _id: "bob",
//     name: "Bob",
//   },
// ]

// const ingredients: Ingredient[] = [
//   {
//     _id: "A",
//     name: "Pineapple",
//     price: 10,
//   },
//   {
//     _id: "B",
//     name: "Banana",
//     price: 10,
//   },
//   {
//     _id: "C",
//     name: "Apple",
//     price: 10,
//   },
// ]

const students: StudentWithQuestion[] = [
  {
    studentId: "1",
    name: "Ruoxuan",
    question: "Why Henry dreams of stir fried roach",
    position: 1,
  },
  {
    studentId: "2",
    name: "Henry",
    question: "Why Miley is so pretty",
    position: 2,
  },
]

const users: RegisteredUsers[] = [
  {
    isStaff: true,
    username: "Prof Quan",
    password: "123456",
  },
  {
    isStaff: true,
    username: "Hanze",
    password: "123456",
  },
  {
    isStaff: true,
    username: "Chengke",
    password: "123456",
  },
  {
    isStaff: true,
    username: "Qirui",
    password: "123456",
  },
  {
    isStaff: true,
    username: "Sai",
    password: "123456",
  },
  {
    isStaff: false,
    username: "Henry",
    password: "123456",
  },
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  // db.collection("orders").createIndex(
  //   { customerId: 1 }, 
  //   { unique: true, partialFilterExpression: { state: "draft" } }
  // )

  // add data
  // console.log("inserting customers", await db.collection("customers").insertMany(customers as any))
  // console.log("inserting operators", await db.collection("operators").insertMany(operators as any))
  // console.log("inserting ingredients", await db.collection("possibleIngredients").insertMany(ingredients as any))
  
  console.log("inserting students", await db.collection("students").insertMany(students as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))
  process.exit(0)
}

main()
