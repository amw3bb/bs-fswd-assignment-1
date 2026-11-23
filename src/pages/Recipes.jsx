import { PostList } from '../components/PostList.jsx'
import { Header } from '../components/Header.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export function Recipes() {
  const filters = {
    author: '',
    sortBy: 'createdAt',
    sortOrder: 'descending',
  }
  const postsQuery = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters),
  })
  const posts = postsQuery.data ?? []
  return (
    <Box sx={{ width: '100%' }}>
      <Header />
      <Stack spacing={3} sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        <PostList posts={posts} />
      </Stack>
    </Box>
  )
}
