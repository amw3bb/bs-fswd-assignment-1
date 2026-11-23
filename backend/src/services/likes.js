import { Types } from 'mongoose'
import { Like } from '../db/models/like.js'

export async function likePost(postId, userId) {
  return await Like.findOneAndUpdate(
    { post: postId, userId },
    { $setOnInsert: { post: postId, userId } },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  )
}

export async function getPostLikes(postId, userId) {
  const [likes, liked] = await Promise.all([
    Like.countDocuments({ post: postId }),
    Like.exists({ post: postId, userId }),
  ])
  return { likes, liked: Boolean(liked) }
}

export async function getPostLikesCounts(postIds) {
  const counts = await Like.aggregate([
    {
      $match: {
        post: { $in: postIds.map((postId) => new Types.ObjectId(postId)) },
      },
    },
    { $group: { _id: '$post', likes: { $sum: 1 } } },
  ])
  return Object.fromEntries([
    ...postIds.map((postId) => [postId, 0]),
    ...counts.map(({ _id, likes }) => [_id.toString(), likes]),
  ])
}
