import { createServer } from 'node:http'
import { MongoClient } from 'mongodb'

const uri = globalThis.process?.env.MONGODB_URI ?? 'mongodb://admin:123@localhost:27017/mydb?authSource=admin'
const dbName = 'mydb'
const client = new MongoClient(uri)

try {
  await client.connect()
  console.log('Connected to MongoDB')
} catch (err) {
  console.error(err.message)
  globalThis.process.exit(1)
}

const server = createServer(async (req, res) => {
  const db = client.db(dbName)
  const users = db.collection('users')
  const usersList = await users.find({}).toArray()
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(usersList))
})

const host = 'localhost'
const port = 3000

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})