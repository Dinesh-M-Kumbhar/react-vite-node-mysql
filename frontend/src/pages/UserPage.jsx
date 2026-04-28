export default function UserPage({ email }) {
  return (
    <div className="card shadow-sm w-100" style={{ maxWidth: 620 }}>
      <div className="card-body">
        <h1 className="card-title">User Dashboard</h1>
        <p className="text-muted mb-4">Welcome to the user page.</p>
        <div className="alert alert-secondary mb-0">
          Logged in as <strong>{email}</strong>.
        </div>
      </div>
    </div>
  );
}
