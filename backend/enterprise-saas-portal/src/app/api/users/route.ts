import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    // Exclude passwords
    const safeUsers = allUsers.map(({ password, ...user }) => user);
    return NextResponse.json({ data: safeUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
