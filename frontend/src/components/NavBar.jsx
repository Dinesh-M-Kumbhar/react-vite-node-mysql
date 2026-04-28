import { NavLink } from 'react-router-dom';

export default function NavBar({ isLoggedIn, onLogout }) {
  return (
    <header className="sticky-top bg-white border-bottom py-3">
      <div className="container d-flex align-items-center justify-content-between gap-3">
        <div className="h5 mb-0 fw-bold">JWT Dashboard</div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`
            }
          >
            Admin
          </NavLink>
        </div>

        {isLoggedIn && (
          <button type="button" className="btn btn-sm btn-danger" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
