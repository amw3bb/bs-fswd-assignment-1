import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createPost } from '../api/posts.js'
import { Link as RouterLink } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function CreatePost() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost(token, { title, contents, imageUrl }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }
  if (!token) {
    return (
      <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        <Alert severity='info'>Please log in to create new posts.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      <Paper
        component='form'
        onSubmit={handleSubmit}
        variant='outlined'
        sx={{ width: '100%', p: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={2}>
          <Typography variant='h4' component='h1'>
            Create a recipe
          </Typography>
          {createPostMutation.isError && (
            <Alert severity='error'>
              Unable to create recipe. Please try again.
            </Alert>
          )}
          <TextField
            fullWidth
            required
            label='Title'
            name='create-title'
            id='create-title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label='Image URL'
            name='create-image-url'
            id='create-image-url'
            type='url'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            minRows={6}
            label='Recipe'
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
          <Button
            type='submit'
            variant='contained'
            disabled={!title || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
          {createPostMutation.isSuccess && (
            <Alert severity='success'>
              Recipe created successfully! Go back to{' '}
              <Link component={RouterLink} to='/'>
                home
              </Link>
              .
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}
