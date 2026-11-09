import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'
import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

export function App() {
  return (
    <div style={{ margin: '0 auto', maxWidth: '100%', padding: '20px' }}>
      <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </QueryClientProvider>
      </HelmetProvider>
    </div>
  )
}