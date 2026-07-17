'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTransactionPage() {
  const [type, setType] = useState('credit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
        return;
      }

      router.push('/transactions');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Transaction</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="subscription">Subscription</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Amount</label>
          <input 
            type="number" 
            step="0.01"
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            required
            placeholder="0.00"
          />
        </div>
        
        <button type="submit" className="w-full primary-btn py-2">Create Transaction</button>
      </form>
    </div>
  );
}
