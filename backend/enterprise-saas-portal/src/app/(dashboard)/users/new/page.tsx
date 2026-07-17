'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function NewUserPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('end_user');
  const [error, setError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

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
        showToast(data.error || 'Failed to create user', 'error');
        return;
      }

      showToast('User created successfully!', 'success');
      router.push('/users');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-xl font-bold mb-6 text-white">Add New User</h2>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-8">
          <label>Role</label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
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
