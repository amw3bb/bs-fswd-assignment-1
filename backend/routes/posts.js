import { Router } from 'express'
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from '../services/posts.js'

const postsRouter = Router()

postsRouter
  .route('/')
  .get(async (_req, res) => {
    res.json(await listPosts())
  })
  .post(async (req, res) => {
    const post = await createPost(req.body)
    res.status(201).json(post)
  })

postsRouter
  .route('/:id')
  .get(async (req, res) => {
    const post = await getPost(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(post)
  })
  .put(async (req, res) => {
    const post = await updatePost(req.params.id, req.body)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(post)
  })
  .delete(async (req, res) => {
    const post = await deletePost(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(post)
  })

export default postsRouter
