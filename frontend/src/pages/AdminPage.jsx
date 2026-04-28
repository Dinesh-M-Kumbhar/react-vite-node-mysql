export default function AdminPage({
  newUserEmail,
  newUserPassword,
  adminMessage,
  onNewUserEmailChange,
  onNewUserPasswordChange,
  onCreateUser
}) {
  return (
    <div className="card shadow-sm w-100" style={{ maxWidth: 620 }}>
      <div className="card-body">
        <h1 className="card-title">Admin Panel</h1>
        <p className="text-muted mb-4">Create new users from the admin page.</p>

        <form onSubmit={onCreateUser} className="d-grid gap-3">
          <div>
            <label htmlFor="adminEmail" className="form-label">
              New user email
            </label>
            <input
              id="adminEmail"
              type="email"
              value={newUserEmail}
              onChange={onNewUserEmailChange}
              required
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="adminPassword" className="form-label">
              New user password
            </label>
            <input
              id="adminPassword"
              type="password"
              value={newUserPassword}
              onChange={onNewUserPasswordChange}
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create User
          </button>
        </form>

        {adminMessage && <div className="alert alert-info mt-4">{adminMessage}</div>}
      </div>
    </div>
  );
}
