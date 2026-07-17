export default function UsersPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Manage Users</h2>
        <button className="primary-btn">+ Add User</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tenant ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i}>
                <td><div className="skeleton-row" style={{ width: '120px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '180px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '80px' }}></div></td>
                <td><div className="skeleton-row" style={{ width: '60px' }}></div></td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#475569' }}>Edit</button>
                  <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ef4444' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
