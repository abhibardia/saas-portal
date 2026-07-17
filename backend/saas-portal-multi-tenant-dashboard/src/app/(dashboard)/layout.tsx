import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container">
          <h2>SaaS Portal</h2>
        </div>
        <nav className="nav-links">
          <a href="/" className="nav-item active">Dashboard</a>
          <a href="/tenants" className="nav-item">Tenants</a>
          <a href="/users" className="nav-item">Users</a>
          <a href="/transactions" className="nav-item">Transactions</a>
        </nav>
        <div className="user-profile">
          <div className="avatar">U</div>
          <span>User Name</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>Overview</h1>
          <button className="primary-btn">Logout</button>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
