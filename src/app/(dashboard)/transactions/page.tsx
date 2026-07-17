export default function TransactionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Transaction History</h2>
        <a href="/transactions/new" className="primary-btn" style={{ textDecoration: 'none' }}>+ New Transaction</a>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i}>
                <td><div className="skeleton-row" style={{ width: '80px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '100px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '70px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '120px' }}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
