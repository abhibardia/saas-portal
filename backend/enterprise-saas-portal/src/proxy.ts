import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const publicRoutes = ['/login', '/api/auth/login', '/api/health'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await decrypt(session);
    
    // Pass session payload to API routes via headers or we can just let API routes re-decode it
    // We will just let it pass for now.
    
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/health|api/auth/login).*)'],
};
