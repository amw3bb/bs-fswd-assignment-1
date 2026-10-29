import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipes } from './pages/Recipes.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { CreatePost } from './components/CreatePost.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Recipes />,
  },
   {
     path: '/signup',
     element: <Signup />,
    },
   {
     path: '/login',
     element: <Login />,
    },
    {
     path: '/post',
     element: <CreatePost />,
    },
])
export function App() {
  return (
    <div style={{margin: '0 auto', maxWidth: '100%', padding: '20px'}}>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
    </div>
  )
}