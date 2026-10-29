import PropTypes from 'prop-types'
import { User } from './User.jsx'
export function Post({ title, contents, imageUrl, author }) {
  return (
    <article>
      <h3>{title}</h3>
      {imageUrl && <img src={imageUrl} alt={title} loading='lazy' />}
      <div>{contents}</div>
      {author && (
        <em>
          <br />
          Written by <User id={author} />

        </em>
      )}
    </article>
  )
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  imageUrl: PropTypes.string,
  author: PropTypes.string,
}