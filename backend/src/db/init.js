import mongoose from 'mongoose'
export function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Create a .env file from env.template and set it to your MongoDB connection string.',
    )
  }

  mongoose.connection.on('open', () => {
    console.info('successfully connected to database:', DATABASE_URL)
  })
  const connection = mongoose.connect(DATABASE_URL)
  return connection
}
