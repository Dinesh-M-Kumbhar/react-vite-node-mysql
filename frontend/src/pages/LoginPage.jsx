export default function LoginPage({
  email,
  password,
  message,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onLogout,
  isLoggedIn,
  isAdmin
}) {
  return (
    <div className="card shadow-sm w-100" style={{ maxWidth: 620 }}>
      <div className="card-body">
        <h1 className="card-title">JWT Login Demo</h1>
        <p className="text-muted mb-4">Use the sample credentials to log in.</p>

        {isLoggedIn ? (
          <div className="alert alert-success d-grid gap-3">
            <p className="mb-2">
              Logged in as <strong>{email}</strong>.
              {isAdmin ? ' Admin access enabled.' : ' User access enabled.'}
            </p>
            <button type="button" className="btn btn-primary" onClick={onLogout}>
              Log out
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <div>
              <label htmlFor="loginEmail" className="form-label">
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={onEmailChange}
                required
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="loginPassword" className="form-label">
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={onPasswordChange}
                required
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        )}

        {message && <div className="alert alert-info mt-4">{message}</div>}

        <div className="card bg-light border-0 mt-4">
          <div className="card-body p-3">
            <p className="fw-semibold mb-2">Sample accounts:</p>
            <p className="mb-1">Admin: admin@admin.com / Admin123!</p>
            <p className="mb-0">User: demo@demo.com / Password123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
