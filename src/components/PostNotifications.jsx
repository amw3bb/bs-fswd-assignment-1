import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function PostNotifications() {
  const { socket } = useSocket()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    if (!socket) return

    function handlePostCreated(notification) {
      setRecipe(notification)
    }

    socket.on('post.created', handlePostCreated)
    return () => socket.off('post.created', handlePostCreated)
  }, [socket])

  return (
    <Dialog open={Boolean(recipe)} onClose={() => setRecipe(null)}>
      {recipe && (
        <>
          <DialogTitle>New recipe added</DialogTitle>
          <DialogContent>
            <Link
              component={RouterLink}
              to={`/posts/${encodeURIComponent(recipe.id)}`}
              onClick={() => setRecipe(null)}
            >
              {recipe.title}
            </Link>
          </DialogContent>
        </>
      )}
    </Dialog>
  )
}
