import './dashboard.css';

import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
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
