import { useEffect, useState } from 'react';
import { jsonFetch } from '../api.js';

export default function ProfilePage({ user }) {
  const [counts, setCounts] = useState({ posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await jsonFetch('/posts/mine', { auth: true });
        setCounts({ posts: data.posts.length });
      } catch (error) {
        setCounts({ posts: 0 });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="card shadow-sm" style={{ maxWidth: 760 }}>
      <div className="card-body">
        <h1 className="card-title mb-3">Profile</h1>
        <p className="text-muted mb-4">Manage your account and view your activity summary.</p>
        <div className="mb-3">
          <strong>Email</strong>
          <div>{user?.email || 'Not available'}</div>
        </div>
        <div className="mb-3">
          <strong>Role</strong>
          <div>{user?.isAdmin ? 'Admin' : 'Contributor'}</div>
        </div>
        <div className="mb-3">
          <strong>Posts</strong>
          <div>{loading ? 'Loading…' : counts.posts}</div>
        </div>
      </div>
    </div>
  );
}
