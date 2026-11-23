import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Post } from '../components/Post.jsx'
import { getPostById } from '../api/posts.js'
import { useEffect, useState } from 'react'
import {
  getPostLikes,
  getPostLikesCounts,
  likePost,
  postTrackEvent,
} from '../api/events.js'
import { getUserInfo } from '../api/users.js'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext.jsx'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function ViewPost({ postId }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data
  const likesCountQuery = useQuery({
    queryKey: ['likes-counts', [postId]],
    queryFn: () => getPostLikesCounts([postId]),
  })
  const likesQuery = useQuery({
    queryKey: ['likes', postId, token],
    queryFn: () => getPostLikes(token, postId),
    enabled: Boolean(token),
  })
  const likeMutation = useMutation({
    mutationFn: () => likePost(token, postId),
    onSuccess: (likes) => {
      queryClient.setQueryData(['likes', postId, token], likes)
      queryClient.invalidateQueries({ queryKey: ['likes-counts'] })
    },
  })
  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInfoQuery.data ?? {}
  function truncate(str, max = 160) {
    if (!str) return str
    if (str.length > max) {
      return str.slice(0, max - 3) + '...'
    } else {
      return str
    }
  }
  return (
    <Box sx={{ width: '100%' }}>
      {post && (
        <Helmet>
          <title>{post.title}</title>
          <meta name='description' content={truncate(post.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <Stack spacing={2} sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        <MuiLink
          component={Link}
          to='/'
          underline='hover'
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to main page
        </MuiLink>
        <Divider />
        {post ? (
          <Box sx={{ width: '100%' }}>
            <Post
              {...post}
              fullPost
              likesCount={likesCountQuery.data?.[postId] ?? 0}
            />
            {token ? (
              <Stack spacing={1} sx={{ mt: 2, alignItems: 'flex-start' }}>
                <Button
                  variant='contained'
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                >
                  {likesQuery.data?.liked ? 'Liked' : 'Like'}
                </Button>
                {(likesQuery.isError || likeMutation.isError) && (
                  <Alert severity='error'>
                    Unable to load or save likes. Please try again.
                  </Alert>
                )}
              </Stack>
            ) : (
              <Typography sx={{ mt: 2 }}>
                <MuiLink component={Link} to='/login'>
                  Log in
                </MuiLink>{' '}
                to like this recipe.
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>Post with id {postId} not found.</Typography>
        )}
      </Stack>
    </Box>
  )
}
ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
