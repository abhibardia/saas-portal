export default function NewTransactionPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>Create New Transaction</h2>
        <p style={{ color: '#94a3b8' }}>Fill out the details below to record a new transaction.</p>
      </div>

      <div className="form-container">
        <form>
          <div className="form-group">
            <label htmlFor="type">Transaction Type</label>
            <select id="type" name="type">
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input type="number" id="amount" name="amount" placeholder="0.00" step="0.01" />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="submit" className="primary-btn">Submit Transaction</button>
            <a href="/transactions" className="primary-btn" style={{ backgroundColor: '#475569', textDecoration: 'none' }}>Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
