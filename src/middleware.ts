import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add token to headers if it exists
  if (token) {
    requestHeaders.set('x-auth-token', token);
  }
  
  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/talent/:path*',
    '/api/:path*',
  ],
};