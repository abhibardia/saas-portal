'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // A simple way to logout is to clear the cookie. 
    // We can just call an API endpoint or manually clear the cookie.
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="primary-btn">
      Logout
    </button>
  );
}
