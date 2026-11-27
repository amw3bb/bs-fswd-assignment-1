import jwt from 'jsonwebtoken'

export function notify(io, post) {
  io.exclude().emit('post.created', {
    id: post._id.toString(),
    title: post.title,
  })
}

export function handleSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next()

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return next(new Error('error'))
      }

      socket.auth = decodedToken
      return next()
    })
  })

  io.on('connection', (socket) => {
    if (socket.auth?.sub) socket.join(`user:${socket.auth.sub}`)
  })
}
