import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'tenant_owner', 'end_user']).optional(),
  tenantId: z.string().uuid().optional().nullable(),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await db.delete(users).where(eq(users.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
