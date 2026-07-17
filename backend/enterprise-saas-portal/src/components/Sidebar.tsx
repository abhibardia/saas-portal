'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, ArrowRightLeft, UserCircle } from 'lucide-react';

interface SidebarProps {
  role?: string;
  username?: string;
}

export default function Sidebar({ role = 'end_user', username = 'User' }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    ...(role !== 'end_user' ? [{ name: 'Tenants', href: '/tenants', icon: Building2 }] : []),
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Profile', href: '/users/profile', icon: UserCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h2>SaaS Portal</h2>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="user-profile">
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{username}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>{role.replace('_', ' ')}</span>
        </div>
      </div>
    </aside>
  );
}
