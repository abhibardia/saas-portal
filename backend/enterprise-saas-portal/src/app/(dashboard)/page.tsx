import { db } from '@/db';
import { tenants, users, transactions } from '@/db/schema';
import { count, sum, desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import DashboardCharts from '@/components/DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  const session = await decrypt(sessionCookie);
  const isAdmin = session.role === 'admin';
  const tenantId = session.tenantId as string;

  // Fetch aggregate data
  const [tenantCountResult] = await db.select({ value: count() }).from(tenants);
  
  const [userCountResult] = !isAdmin && tenantId
    ? await db.select({ value: count() }).from(users).where(eq(users.tenantId, tenantId))
    : await db.select({ value: count() }).from(users);
    
  const [txVolumeResult] = !isAdmin && tenantId
    ? await db.select({ value: sum(transactions.amount) }).from(transactions).where(eq(transactions.tenantId, tenantId))
    : await db.select({ value: sum(transactions.amount) }).from(transactions);

  const recentTransactions = !isAdmin && tenantId
    ? await db.select().from(transactions).where(eq(transactions.tenantId, tenantId)).orderBy(desc(transactions.createdAt)).limit(5)
    : await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(5);

  // Mock chart data for last 6 months
  const totalRev = Number(txVolumeResult.value || 0);
  const chartData = [
    { name: 'Jan', revenue: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Feb', revenue: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Mar', revenue: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Apr', revenue: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'May', revenue: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'Jun', revenue: totalRev }, // Current month actual
  ];

  const formatCurrency = (value: string | null) => {
    const num = Number(value || 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Welcome back!</h2>
      
      <div className="stats-grid">
        {isAdmin && (
          <div className="stat-card">
            <h3>Total Tenants</h3>
            <div className="value">{tenantCountResult.value}</div>
          </div>
        )}
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="value">{userCountResult.value}</div>
        </div>
        <div className="stat-card">
          <h3>Transactions Volume</h3>
          <div className="value">{formatCurrency(txVolumeResult.value)}</div>
        </div>
      </div>

      <DashboardCharts data={chartData} />

      <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>No recent activity.</td>
              </tr>
            ) : (
              recentTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                  <td style={{ fontWeight: tx.type === 'credit' ? 'bold' : 'normal', color: tx.type === 'credit' ? '#4ade80' : 'inherit' }}>
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
