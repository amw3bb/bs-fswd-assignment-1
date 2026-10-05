import PropTypes from "prop-types";
import Post from "./Post.jsx";

export default function PostList({ posts = [] }) {
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id ?? post.id}
          {...post}
        />
      ))}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired
};