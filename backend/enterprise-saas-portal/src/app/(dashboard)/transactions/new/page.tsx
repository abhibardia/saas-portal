'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function NewTransactionPage() {
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create transaction');
        showToast(data.error || 'Failed to create transaction', 'error');
        return;
      }

      showToast('Transaction created successfully!', 'success');
      router.push('/transactions');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-xl font-bold mb-6 text-white">New Transaction</h2>
      {error && <div className="text-red-500 mb-4 bg-red-500/10 p-3 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="subscription">Subscription</option>
          </select>
        </div>
        
        <div className="form-group mb-8">
          <label>Amount</label>
          <input 
            type="number" 
            step="0.01"
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            required
            placeholder="0.00"
          />
        </div>
        
        <button type="submit" className="w-full primary-btn py-2">Create Transaction</button>
      </form>
    </div>
  );
}
