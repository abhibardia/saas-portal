'use client';

import { useEffect, useState } from 'react';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<{id: string, name: string, description: string, createdAt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tenants')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(resData => {
        setTenants(resData.data || []);
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
        <h2>Manage Tenants</h2>
        <button className="primary-btn">+ Add Tenant</button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={5}>No tenants found.</td>
              </tr>
            ) : (
              tenants.map(tenant => (
                <tr key={tenant.id}>
                  <td>{tenant.id.slice(0, 8)}...</td>
                  <td>{tenant.name}</td>
                  <td>{tenant.description}</td>
                  <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#475569' }}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
