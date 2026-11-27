import { describe, expect, jest, test } from '@jest/globals'
import { handleSocket, notify } from '../socket.js'

describe('recipe notifications', () => {
  test('broadcasts a new post to every connected socket', () => {
    const emit = jest.fn()
    const io = { emit }
    const post = {
      _id: { toString: () => 'recipe-id' },
      author: 'author',
      title: 'New recipe',
    }

    notify(io, post)

    expect(emit).toHaveBeenCalledWith('post.created', {
      id: 'recipe-id',
      title: 'New recipe',
    })
  })

  test('allows unauthenticated browsers to connect for notifications', () => {
    const io = {
      use: jest.fn(),
      on: jest.fn(),
    }
    const next = jest.fn()

    handleSocket(io)
    const authenticate = io.use.mock.calls[0][0]
    authenticate({ handshake: { auth: {} } }, next)

    expect(next).toHaveBeenCalledWith()
  })
})
