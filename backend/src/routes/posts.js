import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  deletePost,
  updatePost,
  createPost,
} from '../services/posts.js'
import { requireAuth } from '../../middleware/jwt.js'
export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
  })
  app.get('/api/v1/posts/:id', async (req, res) => {

  })
  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.body)
      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })
  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error updating post', err)
      return res.status(500).end()
    }
  })
  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post', err)
      return res.status(500).end()
    }
  })
}