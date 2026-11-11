import { PostList } from '../components/PostList.jsx'
import { Header } from '../components/Header.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'

export function Recipes() {
  const filters = {
    author: '',
    sortBy: 'createdAt',
    sortOrder: 'descending',
  }
  const postsQuery = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters),
  })
  const posts = postsQuery.data ?? []
  return (
    <div style={{ padding: 8 }}>
      <Header />
      {/* Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      /> */}
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
