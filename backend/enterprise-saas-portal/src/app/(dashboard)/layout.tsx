import './dashboard.css';

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

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
          <Link href="/" className="nav-item active">Dashboard</Link>
          <Link href="/tenants" className="nav-item">Tenants</Link>
          <Link href="/users" className="nav-item">Users</Link>
          <Link href="/transactions" className="nav-item">Transactions</Link>
        </nav>
        <div className="user-profile">
          <div className="avatar">U</div>
          <span>User Name</span>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>Overview</h1>
          <LogoutButton />
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
