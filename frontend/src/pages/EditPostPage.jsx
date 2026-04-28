import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jsonFetch } from '../api.js';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('blog');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await jsonFetch(`/posts/${id}`);
        const { post } = data;
        setTitle(post.title || '');
        setContent(post.content || '');
        setType(post.type || 'blog');
        setStatus(post.status || 'published');
        setTags((post.tags || []).map((t) => t.name).join(', '));
        const videoMedia = post.media?.find((item) => item.type === 'video');
        setVideoUrl(videoMedia?.url || '');
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const media = type === 'video' ? [{ url: videoUrl, type: 'video' }] : [];
      const payload = {
        title,
        content,
        type,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : null,
        media,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      };

      await jsonFetch(`/posts/${id}`, {
        method: 'PUT',
        auth: true,
        body: payload
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading post…</div>;
  }

  return (
    <div className="card shadow-sm" style={{ maxWidth: 760 }}>
      <div className="card-body">
        <h1 className="card-title mb-3">Edit Post</h1>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="blog">Blog / Text</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="6"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>

          {type === 'video' && (
            <div className="col-12">
              <label className="form-label">Video URL</label>
              <input
                type="url"
                className="form-control"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
          )}

          <div className="col-12">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="poetry, story, video"
            />
          </div>

          {message && <div className="alert alert-danger col-12">{message}</div>}

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
