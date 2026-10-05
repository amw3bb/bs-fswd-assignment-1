import { useEffect, useState } from "react";
import PostList from "./components/PostList";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", contents: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        const response = await fetch("/api/posts", { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Could not load posts.");
        }
        setPosts(await response.json());
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPosts();
    return () => controller.abort();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not create post.");
      }
      setPosts((currentPosts) => [result, ...currentPosts]);
      setForm({ title: "", contents: "", author: "" });
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <main>
      <h1>Blog posts</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </label>
        <label>
          Contents
          <textarea
            required
            value={form.contents}
            onChange={(event) => setForm({ ...form, contents: event.target.value })}
          />
        </label>
        <label>
          Author
          <input
            required
            value={form.author}
            onChange={(event) => setForm({ ...form, author: event.target.value })}
          />
        </label>
        <button type="submit">Create post</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Loading posts...</p> : <PostList posts={posts} />}
    </main>
  );
}