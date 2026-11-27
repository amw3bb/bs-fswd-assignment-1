import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useSocket } from '../contexts/SocketIOContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export function useChat() {
  const { socket } = useSocket()
  const [token] = useAuth()
  const username = token ? jwtDecode(token).sub : null
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!socket) return

    function receiveMessage(message) {
      setMessages((currentMessages) => {
        const pendingIndex = currentMessages.findIndex(
          (current) =>
            current.pending &&
            current.username === message.username &&
            current.message === message.message,
        )

        if (pendingIndex !== -1) {
          return currentMessages.map((current, index) =>
            index === pendingIndex ? { ...current, pending: false } : current,
          )
        }

        return [...currentMessages, message]
      })
    }

    socket.on('chat.message', receiveMessage)
    return () => socket.off('chat.message', receiveMessage)
  }, [socket])

  function sendMessage(message) {
    if (!socket?.connected || !username || !message.trim()) return false

    setMessages((currentMessages) => [
      ...currentMessages,
      { username, message, pending: true },
    ])
    socket.emit('chat.message', message)
    return true
  }

  return { messages, sendMessage }
}