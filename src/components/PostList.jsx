import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPostLikesCounts } from '../api/events.js'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

export function PostList({
  posts = [],
  sortBy = 'createdAt',
  sortOrder = 'descending',
}) {
  const postIds = posts.map((post) => post._id)
  const likesQuery = useQuery({
    queryKey: ['likes-counts', postIds],
    queryFn: () => getPostLikesCounts(postIds),
    enabled: postIds.length > 0,
  })
  const sortedPosts =
    sortBy === 'likes' && likesQuery.data
      ? [...posts].sort((a, b) => {
          const difference =
            (likesQuery.data[a._id] ?? 0) - (likesQuery.data[b._id] ?? 0)
          return sortOrder === 'ascending' ? difference : -difference
        })
      : posts

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {likesQuery.isError && (
        <Alert severity='error'>Unable to load recipe likes.</Alert>
      )}
      {sortedPosts.map((post) => (
        <Post
          key={post._id}
          {...post}
          likesCount={likesQuery.data?.[post._id] ?? 0}
        />
      ))}
    </Stack>
  )
}
PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
}
