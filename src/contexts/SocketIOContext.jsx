import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext.jsx'

export const SocketIOContext = createContext({
  socket: null,
  status: 'waiting',
  error: null,
})

function getSocketHost() {
  const socketHost = import.meta.env.VITE_SOCKET_HOST
  if (socketHost) return socketHost

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  return backendUrl
    ? new URL(backendUrl, window.location.origin).origin
    : undefined
}

export function SocketIOContextProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [status, setStatus] = useState('waiting')
  const [error, setError] = useState(null)
  const [token] = useAuth()

  useEffect(() => {
    setStatus('waiting')
    setError(null)

    const connection = io(getSocketHost(), {
      query: Object.fromEntries(new URLSearchParams(window.location.search)),
      auth: token ? { token } : {},
    })

    function handleConnect() {
      setStatus('connected')
      setError(null)
    }

    function handleConnectError(connectionError) {
      setStatus('error')
      setError(connectionError)
    }

    function handleDisconnect() {
      setStatus('disconnected')
    }

    connection.on('connect', handleConnect)
    connection.on('connect_error', handleConnectError)
    connection.on('disconnect', handleDisconnect)
    setSocket(connection)

    return () => {
      connection.off('connect', handleConnect)
      connection.off('connect_error', handleConnectError)
      connection.off('disconnect', handleDisconnect)
      connection.disconnect()
    }
  }, [token])

  return (
    <SocketIOContext.Provider value={{ socket, status, error }}>
      {children}
    </SocketIOContext.Provider>
  )
}

SocketIOContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useSocket() {
  return useContext(SocketIOContext)
}
