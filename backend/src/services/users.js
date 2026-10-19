import bcrypt from 'bcrypt'
import { User } from '../db/models/user.js'
import { listPostsByAuthor as listPostsByAuthorId } from './posts.js'

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return await new User({ username, password: hashedPassword }).save()
}

export async function authenticateUser(username, password) {
  const user = await User.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null
  }
  return user
}

export async function getUserInfoById(userId) {
  try {
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username }
  } catch (err) {
    return { username: userId }
  }
}

export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listPostsByAuthorId(user._id, options)
}
