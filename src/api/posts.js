const backendUrl = import.meta.env.DEV
  ? '/api/v1'
  : import.meta.env.VITE_BACKEND_URL || '/api/v1'

export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${backendUrl}/posts?` + new URLSearchParams(queryParams),
  )
  return await res.json()
}
export const createPost = async (post) => {
  const res = await fetch(
    `${backendUrl}/posts`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    },
  )
  return await res.json()
}
