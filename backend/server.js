import process from 'node:process'
import mongoose from 'mongoose'
import app from './app.js'

const uri = process.env.MONGODB_URI
const port = Number(process.env.PORT ?? 3000)

if (!uri) {
  throw new Error('Set MONGODB_URI before starting the backend.')
}

try {
  await mongoose.connect(uri)
  app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`)
  })
} catch (error) {
  console.error('Could not connect to MongoDB:', error)
  process.exitCode = 1
}