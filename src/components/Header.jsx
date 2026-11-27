import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const { socket } = useSocket()

  const handleLogout = () => {
    socket.disconnect()
    setToken(null)
  }
  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          Hi there {sub}!
        </div>
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
