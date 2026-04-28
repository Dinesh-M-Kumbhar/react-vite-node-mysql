const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function jsonFetch(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options;
  const fetchOptions = {
    method,
    headers: {
      ...headers
    }
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
    fetchOptions.headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem('jwt');
    if (token) {
      fetchOptions.headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, fetchOptions);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
