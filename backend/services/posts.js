import Post from '../models/Post.js'

export function createPost(postData) {
  return Post.create(postData)
}

export function listPosts() {
  return Post.find().sort({ createdAt: -1 })
}

export function getPost(id) {
  return Post.findById(id)
}

export function updatePost(id, postData) {
  return Post.findByIdAndUpdate(id, postData, {
    new: true,
    runValidators: true,
  })
}

export function deletePost(id) {
  return Post.findByIdAndDelete(id)
}
