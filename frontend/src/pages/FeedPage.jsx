import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsonFetch, formatDate } from '../api.js';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await jsonFetch('/posts');
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className="w-100" style={{ maxWidth: 900 }}>
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-4 gap-3">
        <div>
          <h1 className="mb-1">Public Feed</h1>
          <p className="text-muted mb-0">Read the latest thoughts, stories, poems, and video posts from the community.</p>
        </div>
        <Link to="/posts/create" className="btn btn-primary align-self-start">
          Create post
        </Link>
      </div>

      {loading && <div className="text-center py-5">Loading posts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && posts.length === 0 && <div className="alert alert-secondary">No published posts yet.</div>}

      <div className="row gy-4">
        {posts.map((post) => (
          <div className="col-12" key={post.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span className="badge bg-info text-dark me-2">{post.type}</span>
                    <span className="badge bg-secondary text-white">{post.status}</span>
                  </div>
                  <small className="text-muted">{formatDate(post.publishedAt)}</small>
                </div>
                <h2 className="h5 card-title">{post.title}</h2>
                <p className="text-muted mb-3">
                  By <strong>{post.author?.email || 'Unknown author'}</strong>
                </p>
                <p className="card-text text-truncate" style={{ maxHeight: '5rem' }}>
                  {post.content || 'No content provided.'}
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {post.tags?.map((tag) => (
                    <span className="badge bg-light text-dark border" key={tag.id}>#{tag.name}</span>
                  ))}
                </div>
                <Link to={`/posts/${post.id}`} className="btn btn-outline-primary btn-sm">
                  View post
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
