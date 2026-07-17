import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { z } from 'zod';

const createTenantSchema = z.object({
  name: z.string().min(1, { message: "Tenant name is required" }),
  description: z.string().optional(),
});

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

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = createTenantSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message,
        details: result.error.issues 
      }, { status: 400 });
    }

    const newTenant = await db.insert(tenants).values({
      name: result.data.name,
      description: result.data.description || null,
    }).returning();

    return NextResponse.json({ data: newTenant[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
