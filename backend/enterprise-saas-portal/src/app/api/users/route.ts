import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';

const createUserSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(['admin', 'tenant_owner', 'end_user']).default('end_user'),
});

export async function GET() {
  try {
    const allUsers = await db.select().from(users).limit(100);
    const safeUsers = allUsers.map(({ password, ...user }) => user);
    return NextResponse.json({ data: safeUsers });
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
    
    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.issues[0].message,
        details: result.error.issues 
      }, { status: 400 });
    }

    if (!session.tenantId && result.data.role !== 'admin') {
      return NextResponse.json({ error: 'Cannot create user without a tenant context' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = await db.insert(users).values({
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
      role: result.data.role,
      tenantId: session.tenantId, // For simplicity, assign to the creator's tenant
    }).returning();

    // Remove password from response
    const { password: _, ...safeUser } = newUser[0];

    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
