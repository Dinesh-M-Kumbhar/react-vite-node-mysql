import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NavBar from './components/NavBar.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api/auth';

function App() {
  const [email, setEmail] = useState('demo@demo.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [loading, setLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const isLoggedIn = Boolean(token);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('jwt', data.token);
      localStorage.setItem('isAdmin', data.user.isAdmin ? 'true' : 'false');
      setToken(data.token);
      setIsAdmin(data.user.isAdmin);
      setMessage('Login successful! JWT saved to localStorage.');
    } catch (error) {
      setMessage(error.message);
      setToken('');
      setIsAdmin(false);
      localStorage.removeItem('jwt');
      localStorage.removeItem('isAdmin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setIsAdmin(false);
    setMessage('Logged out.');
    setAdminMessage('');
    localStorage.removeItem('jwt');
    localStorage.removeItem('isAdmin');
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setAdminMessage('');

    if (!token) {
      setAdminMessage('Admin login required.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create user.');
      }

      setAdminMessage(`User created: ${data.user.email}`);
      setNewUserEmail('');
      setNewUserPassword('');
    } catch (error) {
      setAdminMessage(error.message);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main className="container py-5 d-flex justify-content-center">
          <Routes>
            <Route
              path="/"
              element={
                <LoginPage
                  email={email}
                  password={password}
                  message={message}
                  loading={loading}
                  isLoggedIn={isLoggedIn}
                  isAdmin={isAdmin}
                  onEmailChange={(event) => setEmail(event.target.value)}
                  onPasswordChange={(event) => setPassword(event.target.value)}
                  onSubmit={handleSubmit}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/admin"
              element={
                isLoggedIn ? (
                  isAdmin ? (
                    <AdminPage
                      newUserEmail={newUserEmail}
                      newUserPassword={newUserPassword}
                      adminMessage={adminMessage}
                      onNewUserEmailChange={(event) => setNewUserEmail(event.target.value)}
                      onNewUserPasswordChange={(event) => setNewUserPassword(event.target.value)}
                      onCreateUser={handleCreateUser}
                    />
                  ) : (
                    <div className="card shadow-sm w-100" style={{ maxWidth: 620 }}>
                      <div className="card-body">
                        <h1 className="card-title">Admin Access Required</h1>
                        <p className="text-muted mb-0">You must be logged in as admin to view this page.</p>
                      </div>
                    </div>
                  )
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
