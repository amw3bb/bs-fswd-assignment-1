import { API_BASE_URL } from './config.js'

export const postTrackEvent = (event) =>
  fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((res) => res.json())
export const getPostLikes = async (token, postId) => {
  const res = await fetch(`${API_BASE_URL}/events/likes/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: 'GET',
  })
  if (!res.ok) throw new Error('failed to get recipe likes')
  return await res.json()
}
export const getPostLikesCounts = async (postIds) => {
  if (postIds.length === 0) return {}
  const params = new URLSearchParams({ postIds: postIds.join(',') })
  const res = await fetch(`${API_BASE_URL}/events/likes?${params}`)
  if (!res.ok) throw new Error('failed to get recipe likes')
  return await res.json()
}
export const likePost = async (token, postId) => {
  const res = await fetch(`${API_BASE_URL}/events/likes/${postId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('failed to like recipe')
  return await res.json()
}
export const getTotalViews = (postId) =>
  fetch(`${API_BASE_URL}/events/totalViews/${postId}`).then((res) => res.json())
export const getDailyViews = (postId) =>
  fetch(`${API_BASE_URL}/events/dailyViews/${postId}`).then((res) => res.json())
export const getDailyDurations = (postId) =>
  fetch(`${API_BASE_URL}/events/dailyDurations/${postId}`).then((res) =>
    res.json(),
  )
