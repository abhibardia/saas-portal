import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) return NextResponse.json({ role: null, userId: null });
    
    const session = await decrypt(sessionCookie);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ role: null, userId: null });
  }
}
