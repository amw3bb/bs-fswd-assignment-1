import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users.js'
import Typography from '@mui/material/Typography'

export function User({ id }) {
  const userInfoQuery = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserInfo(id),
  })
  const userInfo = userInfoQuery.data ?? {}
  return (
    <Typography component='span' variant='inherit' fontWeight={700}>
      {userInfo?.username ?? id}
    </Typography>
  )
}
User.propTypes = {
  id: PropTypes.string.isRequired,
}
