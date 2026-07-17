import './dashboard.css';

import Sidebar from '@/components/Sidebar';
import LogoutButton from '@/components/LogoutButton';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = (await cookies()).get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  return (
    <div className="dashboard-container">
      <Sidebar 
        role={session?.role as string || 'end_user'} 
        username={session?.username as string || 'User'} 
      />
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
