import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jsonFetch, formatDate } from '../api.js';

function renderMedia(media) {
  if (!media || media.length === 0) return null;
  const item = media[0];
  if (!item.url) return null;

  if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
    const videoIdMatch = item.url.match(/(?:v=|\/)([\w-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (videoId) {
      return (
        <div className="ratio ratio-16x9 mb-4">
          <iframe
            title="Video post"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (item.url.endsWith('.mp4')) {
    return (
      <div className="mb-4">
        <video controls className="w-100 rounded">
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-outline-secondary">
        View media
      </a>
    </div>
  );
}

export default function PostDetailsPage({ isLoggedIn, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const loadPost = async () => {
    try {
      const data = await jsonFetch(`/posts/${id}`);
      setPost(data.post);
      setComments(data.post.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await jsonFetch('/comments', {
        method: 'POST',
        auth: true,
        body: { postId: id, content: commentText }
      });
      setCommentText('');
      loadPost();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading post…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!post) {
    return <div className="alert alert-warning">Post not found.</div>;
  }

  const canManage = isLoggedIn && user?.id === post.authorId;

  return (
    <div className="w-100" style={{ maxWidth: 850 }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="mb-1">{post.title}</h1>
          <div className="text-muted">
            {post.type} post • {formatDate(post.publishedAt)} • by <strong>{post.author?.email}</strong>
          </div>
        </div>
        <div className="d-flex gap-2">
          {canManage && (
            <button className="btn btn-outline-primary" onClick={() => navigate(`/posts/edit/${post.id}`)}>
              Edit
            </button>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to feed</button>
        </div>
      </div>

      {renderMedia(post.media)}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h6 mb-3">Story</h2>
          <p className="mb-0 text-break">{post.content || 'No additional content.'}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="h6">Tags</h3>
        <div className="d-flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span className="badge bg-light text-dark border" key={tag.id}>#{tag.name}</span>
          ))}
          {!post.tags?.length && <span className="text-muted">No tags yet.</span>}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="h5">Comments</h3>
        {comments.length === 0 ? (
          <div className="text-muted">No comments yet. Be the first to add one.</div>
        ) : (
          comments.map((comment) => (
            <div className="card mb-3" key={comment.id}>
              <div className="card-body">
                <p className="mb-1">{comment.content}</p>
                <small className="text-muted">By {comment.author?.email || 'anonymous'}</small>
              </div>
            </div>
          ))
        )}
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleCommentSubmit} className="card shadow-sm p-4">
          <h4 className="h6 mb-3">Add a comment</h4>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Post comment</button>
        </form>
      ) : (
        <div className="alert alert-secondary">Log in to post comments.</div>
      )}
    </div>
  );
}
