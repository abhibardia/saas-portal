'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<{id: string, username: string, email: string, role: string, createdAt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(resData => {
        setUsers(resData.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Manage Users</h2>
        <button className="primary-btn">+ Add User</button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5}>No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id.slice(0, 8)}...</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
