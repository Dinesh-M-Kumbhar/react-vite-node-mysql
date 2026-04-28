export default function UserPage({ email }) {
  return (
    <div className="page-card">
      <h1>User Dashboard</h1>
      <p className="subtitle">Welcome to the user page.</p>
      <div className="message">
        Logged in as <strong>{email}</strong>.
      </div>
    </div>
  );
}
