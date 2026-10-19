import jwt from 'jsonwebtoken'
import { authenticateUser, createUser, getUserInfoById } from '../services/users.js'

export function userRoutes(app) {
  app.get('/api/v1/users/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).send(userInfo)
  })

  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    const { username, password } = req.body ?? {}
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username ||
      !password
    ) {
      return res.status(400).json({ error: 'username and password are required' })
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('error logging in: JWT_SECRET is not configured')
      return res.status(500).json({ error: 'login is not configured' })
    }

    try {
      const user = await authenticateUser(username, password)
      if (!user) {
        return res.status(401).json({ error: 'invalid username or password' })
      }
      const token = jwt.sign({}, secret, {
        algorithm: 'HS256',
        subject: user.username,
        expiresIn: '1h',
      })
      return res.json({ token })
    } catch (err) {
      console.error('error logging in', err)
      return res.status(500).json({ error: 'failed to log in' })
    }
  })
}