export default function TenantsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Manage Tenants</h2>
        <button className="primary-btn">+ Add Tenant</button>
      </div>

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
            {[1, 2, 3].map(i => (
              <tr key={i}>
                <td><div className="skeleton-row" style={{ width: '60px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '150px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '250px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '100px' }}></div></td>
                <td>
                  <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#475569' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
