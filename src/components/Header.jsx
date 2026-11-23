import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const username = token ? jwtDecode(token).sub : null

  return (
    <AppBar position='static' sx={{ width: '100%' }}>
      <Toolbar sx={{ width: '100%', justifyContent: 'space-between', gap: 2 }}>
        {username ? (
          <Stack
            direction={{ xs: 'column', sm: 'row', lg: 'row' }}
            alignItems='center'
            justifyContent='space-between'
            spacing={{ xs: 0.5, sm: 2 }}
            width='100%'
          >
            <Typography variant='h6'>Hi there, {username}!</Typography>
            <Button component={RouterLink} to='/post' color='inherit'>
              Post a recipe
            </Button>
            <Button
              variant='contained'
              onClick={() => setToken(null)}
              sx={{
                alignSelf: { xs: 'flex-end', sm: 'auto' },
                bgcolor: '#ffeb3b',
                color: '#233127',
                '&:hover': { bgcolor: '#fdd835' },
              }}
            >
              Log out
            </Button>
          </Stack>
        ) : (
          <Stack direction='row' spacing={1}>
            <Button component={RouterLink} to='/login' color='inherit'>
              Log in
            </Button>
            <Button component={RouterLink} to='/signup' color='inherit'>
              Sign up
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  )
}
