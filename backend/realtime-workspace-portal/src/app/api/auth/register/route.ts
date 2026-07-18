import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword, signToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning({ id: users.id, name: users.name, email: users.email });

    const user = newUser[0];
    
    // Sign JWT
    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
