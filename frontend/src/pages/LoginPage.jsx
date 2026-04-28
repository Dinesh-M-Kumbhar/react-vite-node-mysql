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
    <div className="page-card">
      <h1>JWT Login Demo</h1>
      <p className="subtitle">Use the sample credentials to log in.</p>

      {isLoggedIn ? (
        <div className="logged-in-box">
          <p>
            Logged in as <strong>{email}</strong>.
            {isAdmin ? ' Admin access enabled.' : ' User access enabled.'}
          </p>
          <button className="full-width-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="page-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      )}

      {message && <div className="message">{message}</div>}

      <div className="hint">
        <strong>Sample accounts:</strong>
        <div>Admin: admin@admin.com / Admin123!</div>
        <div>User: demo@demo.com / Password123!</div>
      </div>
    </div>
  );
}
