'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ userId }: { userId: string }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.data) {
          setUsername(resData.data.username || '');
          setEmail(resData.data.email || '');
        }
        setLoading(false);
      })
      .catch(err => {
        showToast('Failed to load profile', 'error');
        setLoading(false);
      });
  }, [userId, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = { username, email };
      if (password) payload.password = password; // Only send if updating

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to update profile', 'error');
      } else {
        showToast('Profile updated successfully!', 'success');
        setPassword('');
        router.refresh();
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-container">
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
        <div className="form-group mb-8">
          <label>New Password (leave blank to keep current)</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            minLength={6}
          />
        </div>
        <button type="submit" className="w-full primary-btn py-2 text-white justify-center" disabled={saving}>
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
