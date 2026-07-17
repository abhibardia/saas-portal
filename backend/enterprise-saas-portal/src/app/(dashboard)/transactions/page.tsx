'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<{id: string, type: string, amount: string, createdAt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(resData => {
        setTransactions(resData.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Transactions</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#fff',
              outline: 'none',
              width: '250px'
            }}
          />
          <Link href="/transactions/new">
            <button className="primary-btn">+ New Transaction</button>
          </Link>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4}>No transactions found.</td>
              </tr>
            ) : (
              transactions
                .filter(tx => tx.type.toLowerCase().includes(search.toLowerCase()) || tx.id.includes(search))
                .map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.id.slice(0, 8)}...</td>
                    <td>{tx.type}</td>
                    <td style={{ fontWeight: tx.type === 'credit' ? 'bold' : 'normal', color: tx.type === 'credit' ? '#4ade80' : 'inherit' }}>
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
