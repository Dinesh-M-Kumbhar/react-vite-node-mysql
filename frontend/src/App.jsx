import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx';
import './App.css';

const API_BASE = 'http://localhost:4000/api/auth';

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
      <div className="app-layout">
        <header className="app-header">
          <div className="app-brand">JWT Dashboard</div>
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Home
            </NavLink>
            <NavLink to="/user" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              User
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Admin
            </NavLink>
          </nav>
          {isLoggedIn && (
            <button className="logout-small" onClick={handleLogout}>
              Logout
            </button>
          )}
        </header>

        <main className="app-content">
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
              path="/user"
              element={
                isLoggedIn ? (
                  <UserPage email={email} />
                ) : (
                  <Navigate to="/" replace />
                )
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
                    <div className="page-card">
                      <h1>Admin Access Required</h1>
                      <p className="subtitle">You must be logged in as admin to view this page.</p>
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
