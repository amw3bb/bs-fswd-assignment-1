import { PostList } from '../components/PostList.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { Post } from '../components/Post.jsx'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function Blog({ initialData }) {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () =>
      getPosts({
        author,
        sortBy: sortBy === 'likes' ? 'createdAt' : sortBy,
        sortOrder,
      }),
    initialData,
  })
  const posts = postsQuery.data ?? []
  return (
    <Box sx={{ width: '100%' }}>
      <Helmet>
        <title>Recipes</title>
        <meta
          name='description'
          content='A blog full of articles about full-stack React development.'
        />
      </Helmet>
      <Header />
      <Stack spacing={3} sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        <Typography variant='h4' component='h1'>
          Recipes
        </Typography>
        <Paper variant='outlined' sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
          <Stack direction='column' alignItems='stretch' spacing={2}>
            <Typography variant='subtitle1' fontWeight={600}>
              Filter and sort
            </Typography>
            <PostFilter
              field='Author'
              value={author}
              onChange={(value) => setAuthor(value)}
            />
            <PostSorting
              fields={['createdAt', 'updatedAt', 'likes']}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              orderValue={sortOrder}
              onOrderChange={(orderValue) => setSortOrder(orderValue)}
            />
          </Stack>
        </Paper>
        <Divider />
        <PostList posts={posts} sortBy={sortBy} sortOrder={sortOrder} />
      </Stack>
    </Box>
  )
}
Blog.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)),
}
