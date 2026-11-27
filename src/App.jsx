import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'
//import { io } from 'socket.io-client'

// const socket = io(import.meta.env.VITE_SOCKET_HOST, {
//   query: 'room=' + new URLSearchParams(window.location.search).get('room'),
// })
const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

// socket.on('connect', () => {
//   console.log('connected to socket.io as', socket.id)
// })
// socket.on('connect_error', (err) => {
//   console.error('socket.io connect error:', err)
// })
//socket.on('connect', async () => {
  //console.log('connected to socket.io as', socket.id)
  //socket.emit('chat.message', new URLSearchParams(window.location.search).get('mymsg'), { auth: { token: new URLSearchParams(window.location.search).get('token') } })
  ///const userInfo = await socket.emitWithAck('user.info', socket.id)
  //console.log('user info', userInfo)
//})
// socket.on('connect_error', (err) => {
//   console.error('socket.io connect error:', err)
// })
// socket.on('chat.message', (msg) => {
//           sconsole.log(`${msg.username}: ${msg.message}`)
// })


export function App() {
  return (
    <div style={{ margin: '0 auto', maxWidth: '100%', padding: '20px' }}>
      <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <SocketIOContextProvider>
          <RouterProvider router={router} />
          </SocketIOContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
      </HelmetProvider>
    </div>
  )
}