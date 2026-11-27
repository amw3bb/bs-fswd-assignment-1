import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'
import { HelmetProvider } from 'react-helmet-async'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)
const theme = createTheme({
  palette: {
    primary: { main: '#c54f2d' },
    secondary: { main: '#efbd32' },
    background: { default: '#f2e7cb' },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', Roboto, sans-serif",
  },
  a: {
    textDecoration: 'none',
    color: '#94b38a',
  },
})

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100%' }}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <SocketIOContextProvider>
                <RouterProvider router={router} />
              </SocketIOContextProvider>
            </AuthContextProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </Box>
    </ThemeProvider>
  )
}
