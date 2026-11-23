import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals'
import jwt from 'jsonwebtoken'
import { app } from '../app.js'
import { Event } from '../db/models/event.js'
import { Like } from '../db/models/like.js'
import { Post } from '../db/models/post.js'
import {
  getPostLikes,
  getPostLikesCounts,
  likePost,
} from '../services/likes.js'

let post
let server
let baseUrl

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret'
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

beforeEach(async () => {
  await Event.deleteMany({})
  await Like.deleteMany({})
  await Post.deleteMany({})
  post = await new Post({ title: 'Test recipe' }).save()
})

afterAll(async () => {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  )
})

describe('recipe likes', () => {
  test('records at most one like per user and recipe', async () => {
    await likePost(post._id, 'alice')
    await likePost(post._id, 'alice')

    await expect(Like.countDocuments({})).resolves.toBe(1)
    await expect(Event.countDocuments({})).resolves.toBe(0)
    await expect(getPostLikes(post._id, 'alice')).resolves.toEqual({
      likes: 1,
      liked: true,
    })
  })

  test('counts likes from different users separately', async () => {
    await likePost(post._id, 'alice')
    await likePost(post._id, 'bob')

    await expect(getPostLikes(post._id, 'alice')).resolves.toEqual({
      likes: 2,
      liked: true,
    })
    await expect(getPostLikes(post._id, 'charlie')).resolves.toEqual({
      likes: 2,
      liked: false,
    })
  })

  test('returns counts for a batch of recipes', async () => {
    const anotherPost = await new Post({ title: 'Another recipe' }).save()
    await likePost(post._id, 'alice')
    await likePost(anotherPost._id, 'bob')

    await expect(
      getPostLikesCounts([post._id.toString(), anotherPost._id.toString()]),
    ).resolves.toEqual({
      [post._id.toString()]: 1,
      [anotherPost._id.toString()]: 1,
    })
  })

  test('requires login and records an authenticated like', async () => {
    const url = `${baseUrl}/api/v1/events/likes/${post._id}`
    const unauthorizedResponse = await fetch(url, { method: 'POST' })
    expect(unauthorizedResponse.status).toBe(401)

    const token = jwt.sign({}, 'test-secret', {
      algorithm: 'HS256',
      subject: 'alice',
    })
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ likes: 1, liked: true })
  })

  test('returns a public batch of recipe like counts', async () => {
    await likePost(post._id, 'alice')
    const response = await fetch(
      `${baseUrl}/api/v1/events/likes?postIds=${post._id}`,
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      [post._id.toString()]: 1,
    })
  })
})
