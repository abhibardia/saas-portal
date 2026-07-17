'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/tenants/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tenant details');
        return res.json();
      })
      .then(resData => {
        if (resData.data) {
          setName(resData.data.name || '');
          setDescription(resData.data.description || '');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        showToast(err.message, 'error');
        setLoading(false);
      });
  }, [id, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`/api/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update tenant');
        showToast(data.error || 'Failed to update tenant', 'error');
        return;
      }

      showToast('Tenant updated successfully!', 'success');
      router.push('/tenants');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      showToast('An error occurred', 'error');
    }
  };

  if (loading) {
    return <div className="p-8">Loading tenant details...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="text-xl font-bold mb-6 text-white">Edit Tenant</h2>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tenant Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group mb-8">
          <label>Description</label>
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        
        <button type="submit" className="w-full primary-btn py-2 text-white">Save Changes</button>
      </form>
    </div>
  );
}
