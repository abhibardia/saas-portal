export default function DashboardPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Welcome back!</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tenants</h3>
          <div className="value skeleton-row" style={{ width: '40px', height: '32px' }}></div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="value skeleton-row" style={{ width: '60px', height: '32px' }}></div>
        </div>
        <div className="stat-card">
          <h3>Transactions Volume</h3>
          <div className="value skeleton-row" style={{ width: '100px', height: '32px' }}></div>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i}>
                <td><div className="skeleton-row" style={{ width: '100px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '200px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '60px' }}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
