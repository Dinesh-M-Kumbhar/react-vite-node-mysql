import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import FeedPage from './pages/FeedPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import EditPostPage from './pages/EditPostPage.jsx';
import MyPostsPage from './pages/MyPostsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostDetailsPage from './pages/PostDetailsPage.jsx';
import { jsonFetch } from './api.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setUser(null);
        setIsLoggedIn(false);
        setLoadingProfile(false);
        return;
      }

      try {
        const data = await jsonFetch('/auth/profile', { auth: true });
        setUser(data.user);
        setIsLoggedIn(true);
      } catch (error) {
        handleLogout();
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token]);

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('jwt', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken('');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loadingProfile) {
    return <div className="container py-5 text-center">Loading profile…</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user} />

        <main className="container py-5 d-flex justify-content-center">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleAuthSuccess} />} />
            <Route path="/register" element={<RegisterPage onRegister={handleAuthSuccess} />} />
            <Route path="/posts/create" element={isLoggedIn ? <CreatePostPage /> : <Navigate to="/login" replace />} />
            <Route path="/posts/edit/:id" element={isLoggedIn ? <EditPostPage /> : <Navigate to="/login" replace />} />
            <Route path="/my-posts" element={isLoggedIn ? <MyPostsPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/posts/:id" element={<PostDetailsPage isLoggedIn={isLoggedIn} user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
