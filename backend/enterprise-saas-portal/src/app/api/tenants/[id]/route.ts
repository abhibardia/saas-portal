import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { z } from 'zod';

const updateTenantSchema = z.object({
  name: z.string().min(1, { message: "Tenant name is required" }).optional(),
  description: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    
    // Allow admin, or tenant owner if it's their tenant
    if (session.role !== 'admin' && session.tenantId !== (await params).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = updateTenantSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message,
        details: result.error.issues 
      }, { status: 400 });
    }

    const tenantId = (await params).id;
    
    // Build update object based on what was provided
    const updateData: any = {};
    if (result.data.name !== undefined) updateData.name = result.data.name;
    if (result.data.description !== undefined) updateData.description = result.data.description;
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
    }

    const updatedTenant = await db.update(tenants)
      .set(updateData)
      .where(eq(tenants.id, tenantId))
      .returning();

    if (!updatedTenant.length) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedTenant[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    const tenantId = (await params).id;

    if (session.role !== 'admin' && session.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);

    if (!tenant.length) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ data: tenant[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
