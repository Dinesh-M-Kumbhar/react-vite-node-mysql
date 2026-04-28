export default function AdminPage({
  newUserEmail,
  newUserPassword,
  adminMessage,
  onNewUserEmailChange,
  onNewUserPasswordChange,
  onCreateUser
}) {
  return (
    <div className="page-card">
      <h1>Admin Panel</h1>
      <p className="subtitle">Create new users from the admin page.</p>

      <form onSubmit={onCreateUser} className="page-form">
        <label>
          New user email
          <input
            type="email"
            value={newUserEmail}
            onChange={onNewUserEmailChange}
            required
          />
        </label>

        <label>
          New user password
          <input
            type="password"
            value={newUserPassword}
            onChange={onNewUserPasswordChange}
            required
          />
        </label>

        <button type="submit">Create User</button>
      </form>

      {adminMessage && <div className="message">{adminMessage}</div>}
    </div>
  );
}
