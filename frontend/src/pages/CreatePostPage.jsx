import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsonFetch } from '../api.js';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('blog');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

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

      const data = await jsonFetch('/posts', {
        method: 'POST',
        auth: true,
        body: payload
      });

      navigate(`/posts/${data.post.id}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm" style={{ maxWidth: 760 }}>
      <div className="card-body">
        <h1 className="card-title mb-3">Create a Post</h1>
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
              placeholder={type === 'video' ? 'Add a short description or script for your video post.' : 'Write your blog post or story here.'}
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
