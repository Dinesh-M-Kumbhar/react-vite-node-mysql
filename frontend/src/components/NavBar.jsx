import { NavLink } from 'react-router-dom';

export default function NavBar({ isLoggedIn, onLogout, user }) {
  return (
    <header className="sticky-top bg-white border-bottom py-3">
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
        <NavLink to="/" className="text-decoration-none">
          <span className="h5 mb-0 fw-bold">Blogger/Vlogger</span>
        </NavLink>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
            }
          >
            Feed
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink
                to="/posts/create"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
                }
              >
                Create
              </NavLink>
              <NavLink
                to="/my-posts"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
                }
              >
                My Posts
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
                }
              >
                Profile
              </NavLink>
            </>
          )}
          {!isLoggedIn && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {isLoggedIn && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">{user?.email}</span>
            <button type="button" className="btn btn-sm btn-danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
