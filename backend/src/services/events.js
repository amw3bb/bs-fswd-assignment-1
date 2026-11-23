import { v4 as uuidv4 } from 'uuid'
import { Types } from 'mongoose'
import { Event } from '../db/models/event.js'
export async function trackEvent({
  postId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) {
  const event = new Event({ post: postId, action, session, date })
  return await event.save()
}
export async function likePost(postId, userId) {
  return await Event.findOneAndUpdate(
    { post: postId, action: 'likes', session: userId },
    {
      $setOnInsert: {
        post: postId,
        action: 'likes',
        session: userId,
        date: new Date(),
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  )
}
export async function getPostLikes(postId, userId) {
  const [likes, liked] = await Promise.all([
    Event.countDocuments({ post: postId, action: 'likes' }),
    Event.exists({ post: postId, action: 'likes', session: userId }),
  ])
  return { likes, liked: Boolean(liked) }
}
export async function getPostLikesCounts(postIds) {
  const counts = await Event.aggregate([
    {
      $match: {
        post: { $in: postIds.map((postId) => new Types.ObjectId(postId)) },
        action: 'likes',
      },
    },
    { $group: { _id: '$post', likes: { $sum: 1 } } },
  ])
  return Object.fromEntries([
    ...postIds.map((postId) => [postId, 0]),
    ...counts.map(({ _id, likes }) => [_id.toString(), likes]),
  ])
}
export async function getTotalViews(postId) {
  return {
    views: await Event.countDocuments({ post: postId, action: 'startView' }),
  }
}
export async function getDailyViews(postId) {
  return await Event.aggregate([
    {
      $match: {
        post: postId,
        action: 'startView',
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$date', unit: 'day' },
        },
        views: { $count: {} },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}
export async function getDailyDurations(postId) {
  return await Event.aggregate([
    {
      $match: {
        post: postId,
      },
    },
    {
      $project: {
        session: '$session',
        startDate: {
          $cond: [{ $eq: ['$action', 'startView'] }, '$date', undefined],
        },
        endDate: {
          $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined],
        },
      },
    },
    {
      $group: {
        _id: '$session',
        startDate: { $min: '$startDate' },
        endDate: { $max: '$endDate' },
      },
    },
    {
      $project: {
        day: { $dateTrunc: { date: '$startDate', unit: 'day' } },
        duration: { $subtract: ['$endDate', '$startDate'] },
      },
    },
    {
      $group: {
        _id: '$day',
        averageDuration: { $avg: '$duration' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}
