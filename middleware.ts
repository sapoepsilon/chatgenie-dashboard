import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock function to check if the user is authenticated
// Replace this with your actual authentication logic
function isAuthenticated(request: NextRequest): boolean {
  // Example: Check for a specific cookie or token
  const authToken = request.cookies.get('authToken');
  return authToken !== undefined;
}

export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access to the dashboard if authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Default response
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
