import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jsonFetch, formatDate } from '../api.js';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    try {
      const data = await jsonFetch('/posts/mine', { auth: true });
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      await jsonFetch(`/posts/${postId}`, { method: 'DELETE', auth: true });
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-100" style={{ maxWidth: 900 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="mb-1">My Posts</h1>
          <p className="text-muted mb-0">Manage your drafts and published posts.</p>
        </div>
        <Link to="/posts/create" className="btn btn-primary">
          New post
        </Link>
      </div>

      {loading && <div className="text-center py-5">Loading your posts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && posts.length === 0 && <div className="alert alert-secondary">You have not created any posts yet.</div>}

      <div className="row gy-4">
        {posts.map((post) => (
          <div className="col-12" key={post.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h2 className="h5 mb-1">{post.title}</h2>
                    <div className="text-muted">{post.type} • {post.status} • {formatDate(post.updatedAt)}</div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <Link to={`/posts/${post.id}`} className="btn btn-outline-primary btn-sm">View</Link>
                    <Link to={`/posts/edit/${post.id}`} className="btn btn-outline-secondary btn-sm">Edit</Link>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mb-2 text-truncate">{post.content || 'No description available.'}</p>
                <div className="d-flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span className="badge bg-light text-dark border" key={tag.id}>#{tag.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
