import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true },
)

export const Like = mongoose.model('like', likeSchema)
