import PropTypes from 'prop-types'
import { User } from './User.jsx'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import slug from 'slug'

export function Post({
  title,
  contents,
  author,
  _id,
  fullPost = false,
  likesCount,
}) {
  return (
    <Paper
      component='article'
      variant='outlined'
      sx={{ width: '100%', p: { xs: 2, sm: 3 } }}
    >
      {fullPost ? (
        <Typography variant='h4' component='h1' gutterBottom>
          {title}
        </Typography>
      ) : (
        <Link
          component={RouterLink}
          to={`/posts/${_id}/${slug(title)}`}
          underline='hover'
          color='inherit'
        >
          <Typography variant='h6' component='h2' gutterBottom>
            {title}
          </Typography>
        </Link>
      )}
      {fullPost && (
        <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {contents}
        </Typography>
      )}
      {author && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
          Written by <User id={author} />
        </Typography>
      )}
      {likesCount !== undefined && (
        <Stack direction='row' sx={{ mt: 1 }}>
          <Chip
            size='small'
            label={`${likesCount} ${likesCount === 1 ? 'like' : 'likes'}`}
          />
        </Stack>
      )}
    </Paper>
  )
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
  likesCount: PropTypes.number,
}
