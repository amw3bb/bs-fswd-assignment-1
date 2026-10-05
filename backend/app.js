import express from 'express'
import mongoose from 'mongoose'
import postsRouter from './routes/posts.js'

const app = express()

app.use(express.json())
app.use('/api/posts', postsRouter)

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }
  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: err.message })
  }
  console.error(`Error handling ${req.method} ${req.originalUrl}:`, err)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
