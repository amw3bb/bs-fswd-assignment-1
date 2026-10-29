import mongoose, { Schema } from 'mongoose'
const postSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  contents: String,
  imageUrl: String,
  tags: [String],
},
{
    timestamps: true
})
export const Post = mongoose.model('post', postSchema)
