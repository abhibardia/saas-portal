import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants, users, transactions } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { sql, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    const isAdmin = session.role === 'admin';
    const tenantId = session.tenantId as string;

    // Get basic stats
    const [totalUsers] = !isAdmin && tenantId
      ? await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.tenantId, tenantId))
      : await db.select({ count: sql<number>`count(*)` }).from(users);
      
    const [totalTenants] = await db.select({ count: sql<number>`count(*)` }).from(tenants);
    
    const [totalRevenue] = !isAdmin && tenantId
      ? await db.select({ sum: sql<number>`sum(${transactions.amount})` }).from(transactions).where(eq(transactions.tenantId, tenantId))
      : await db.select({ sum: sql<number>`sum(${transactions.amount})` }).from(transactions);

    // Mock chart data for last 6 months (since we don't have historic data generator yet)
    // In a real scenario we'd do a GROUP BY date
    const chartData = [
      { name: 'Jan', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Feb', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mar', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Apr', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'May', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Jun', revenue: Number(totalRevenue.sum || 0) }, // Current month actual
    ];

    return NextResponse.json({ 
      data: {
        totalUsers: Number(totalUsers.count),
        totalTenants: isAdmin ? Number(totalTenants.count) : null,
        totalRevenue: Number(totalRevenue.sum || 0),
        chartData
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
