import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsonFetch } from '../api.js';

export default function RegisterPage({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = await jsonFetch('/auth/register', {
        method: 'POST',
        body: { email, password }
      });
      onRegister(data.token);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm" style={{ maxWidth: 520 }}>
      <div className="card-body">
        <h1 className="card-title mb-3">Register</h1>
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {message && <div className="alert alert-danger">{message}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
