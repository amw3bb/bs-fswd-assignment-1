import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'
import { HelmetProvider } from 'react-helmet-async'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)
const theme = createTheme({
  palette: {
    primary: { main: '#108ae7' },
    secondary: { main: '#f0f2f6' },
    background: { default: '#f8f8f4' },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', Roboto, sans-serif",
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
              <RouterProvider router={router} />
            </AuthContextProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </Box>
    </ThemeProvider>
  )
}
