import assert from 'node:assert/strict'
import test from 'node:test'
import Post from './Post.js'

test('post model requires a title, contents, and author', async () => {
  const post = new Post({})

  await assert.rejects(post.validate(), (error) => {
    assert.deepEqual(Object.keys(error.errors).sort(), ['author', 'contents', 'title'])
    return true
  })
})

test('post model accepts a complete post', async () => {
  const post = new Post({
    title: 'First post',
    contents: 'Hello blog',
    author: 'Alex',
  })

  await post.validate()
})
