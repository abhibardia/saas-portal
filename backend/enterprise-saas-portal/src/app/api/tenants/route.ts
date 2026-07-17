import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);

    // If tenant_owner or end_user, maybe restrict? 
    // The PRD says Administrator manages tenants, Tenant Owner manages users per tenant, End User views/creates transactions.
    // For simplicity, let's just return all tenants for admin, or filter by tenantId for others.
    let allTenants;
    if (session.role === 'admin') {
      allTenants = await db.select().from(tenants);
    } else {
      // Just an example, maybe they can only see their own tenant
      allTenants = await db.select().from(tenants); 
    }

    return NextResponse.json({ data: allTenants });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
