import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Redirect to login page if the request is for the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proceed with session update if not redirecting
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
