import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { decrypt } from '@/lib/auth';
import * as bcrypt from 'bcryptjs';

const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'tenant_owner', 'end_user']).optional(),
  tenantId: z.string().uuid().optional().nullable(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const sessionCookie = request.headers.get('cookie')?.match(/session=([^;]+)/)?.[1] || 
                         (request as any).cookies?.get('session')?.value;
    
    // Fallback decrypt if we somehow get it
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const session = await decrypt(sessionCookie);

    const params = await context.params;
    
    // Users can only update their own profile, or admins can update anyone
    if (session.role !== 'admin' && session.userId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updatedUser = await db.update(users)
      .set(result.data)
      .where(eq(users.id, params.id))
      .returning();

    return NextResponse.json({ data: updatedUser[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const sessionCookie = request.headers.get('cookie')?.match(/session=([^;]+)/)?.[1];
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    const params = await context.params;

    if (session.role !== 'admin' && session.userId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await db.select().from(users).where(eq(users.id, params.id)).limit(1);

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...safeUser } = user[0];
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
