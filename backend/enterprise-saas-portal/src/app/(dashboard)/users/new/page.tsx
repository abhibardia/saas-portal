'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('end_user');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create user');
        return;
      }

      router.push('/users');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow text-black">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="end_user">End User</option>
            <option value="tenant_owner">Tenant Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button type="submit" className="w-full primary-btn py-2 text-white">Create User</button>
      </form>
    </div>
  );
}
