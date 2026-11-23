import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
  trackEvent,
  getPostLikes,
  getPostLikesCounts,
  likePost,
} from '../services/events.js'
import { getPostById } from '../services/posts.js'
import { requireAuth } from '../../middleware/jwt.js'
import { Types } from 'mongoose'
export function eventRoutes(app) {
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action } = req.body
      if (!['startView', 'endView'].includes(action)) {
        return res.status(400).json({ error: 'unsupported event action' })
      }
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const event = await trackEvent({ postId, session, action })
      return res.json({ session: event.session })
    } catch (err) {
      console.error('error tracking action', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/likes', async (req, res) => {
    try {
      const postIds =
        typeof req.query.postIds === 'string'
          ? [...new Set(req.query.postIds.split(','))]
          : []
      if (
        postIds.length === 0 ||
        postIds.some((postId) => !Types.ObjectId.isValid(postId))
      ) {
        return res.status(400).json({ error: 'valid postIds are required' })
      }
      return res.json(await getPostLikesCounts(postIds))
    } catch (err) {
      console.error('error getting likes counts', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/likes/:postId', requireAuth, async (req, res) => {
    try {
      const post = await getPostById(req.params.postId)
      if (post === null) return res.status(404).end()
      return res.json(await getPostLikes(post._id, req.auth.sub))
    } catch (err) {
      console.error('error getting likes', err)
      return res.status(500).end()
    }
  })
  app.post('/api/v1/events/likes/:postId', requireAuth, async (req, res) => {
    try {
      const post = await getPostById(req.params.postId)
      if (post === null) return res.status(404).end()
      await likePost(post._id, req.auth.sub)
      return res.json(await getPostLikes(post._id, req.auth.sub))
    } catch (err) {
      console.error('error liking recipe', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getTotalViews(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getDailyViews(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      const post = await getPostById(postId)
      if (post === null) return res.status(400).end()
      const stats = await getDailyDurations(post._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
}
