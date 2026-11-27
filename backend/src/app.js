import express from 'express'
//import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { handleSocket } from './socket.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.options('*', cors())
// postsRoutes(app)
userRoutes(app)
eventRoutes(app)
app.get('/', (req, res) => {
  res.send('Hello from Express!')
})
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})
handleSocket(io)
export { server as app }
// export { app }

