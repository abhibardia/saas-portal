import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const createTxSchema = z.object({
  type: z.string().min(1, { message: "Transaction type is required" }),
  amount: z.string().min(1, { message: "Transaction amount is required" }), // Drizzle decimal maps to string initially
});

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);

    let allTx;
    if (session.role === 'admin') {
      allTx = await db.select().from(transactions).limit(100);
    } else if (session.role === 'tenant_owner') {
      if (!session.tenantId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      allTx = await db.select().from(transactions).where(eq(transactions.tenantId, session.tenantId)).limit(100);
    } else {
      // End users see only their own transactions
      allTx = await db.select().from(transactions).where(eq(transactions.userId, session.userId)).limit(100);
    }

    return NextResponse.json({ data: allTx });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const session = await decrypt(sessionCookie);
    const body = await request.json();
    
    const result = createTxSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message,
        details: result.error.issues 
      }, { status: 400 });
    }

    if (!session.tenantId) {
      return NextResponse.json({ error: 'User does not belong to a tenant' }, { status: 400 });
    }

    const newTx = await db.insert(transactions).values({
      type: result.data.type,
      amount: result.data.amount,
      userId: session.userId,
      tenantId: session.tenantId,
    }).returning();

    return NextResponse.json({ data: newTx[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
