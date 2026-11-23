import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/users.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export function Login() {
  const [, setToken] = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/')
    },
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate()
  }
  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <MuiLink
          component={Link}
          to='/'
          underline='hover'
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to main page
        </MuiLink>
        <Paper
          component='form'
          onSubmit={handleSubmit}
          variant='outlined'
          sx={{ width: '100%', p: { xs: 2, sm: 3 } }}
        >
          <Stack spacing={2}>
            <Typography variant='h4' component='h1'>
              Log in
            </Typography>
            {loginMutation.isError && (
              <Alert severity='error'>
                Failed to log in. Please try again.
              </Alert>
            )}
            <TextField
              fullWidth
              required
              label='Username'
              name='create-username'
              id='create-username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label='Password'
              name='create-password'
              id='create-password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type='submit'
              variant='contained'
              disabled={!username || !password || loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Log in'}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
