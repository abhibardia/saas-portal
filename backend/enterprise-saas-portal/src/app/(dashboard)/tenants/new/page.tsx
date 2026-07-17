'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function NewTenantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create tenant');
        showToast(data.error || 'Failed to create tenant', 'error');
        return;
      }

      showToast('Tenant created successfully!', 'success');
      router.push('/tenants');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-xl font-bold mb-6 text-white">Add New Tenant</h2>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tenant Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            required
            placeholder="e.g. Acme Corp"
          />
        </div>
        
        <div className="form-group mb-8">
          <label>Description</label>
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Enterprise Client"
          />
        </div>
        
        <button type="submit" className="w-full primary-btn py-2 text-white">Create Tenant</button>
      </form>
    </div>
  );
}
