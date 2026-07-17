'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<{id: string, type: string, amount: string, createdAt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Transactions</h2>
        <Link href="/transactions/new">
          <button className="primary-btn">+ New Transaction</button>
        </Link>
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
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.id.slice(0, 8)}...</td>
                  <td>{tx.type}</td>
                  <td>${Number(tx.amount).toFixed(2)}</td>
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
