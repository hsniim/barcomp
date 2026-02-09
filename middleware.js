// middleware.js
// FIXED: Exclude /api/upload-image from middleware to prevent interference with file uploads
// FIXED: Added better logging for debugging auth issues

import { NextResponse } from 'next/server';
import { verifyTokenSync } from './src/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk path login
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // FIXED: Skip middleware untuk API upload (prevent FormData corruption)
  if (pathname.startsWith('/api/upload-image')) {
    console.log('[Middleware] Skipping auth check for upload-image API');
    return NextResponse.next();
  }

  // Hanya jalankan untuk path /admin
  if (pathname.startsWith('/admin')) {
    try {
      const token = request.cookies.get('auth_token')?.value;

      console.log(`[Middleware] ${pathname} → token exists? ${!!token}`);
      if (token) {
        console.log(`[Middleware] token preview: ${token.substring(0, 20)}...`);
      } else {
        const cookieHeader = request.headers.get('cookie') || '';
        console.log(`[Middleware] Raw cookie header: ${cookieHeader}`);
      }

      if (!token) {
        console.log(`[Middleware] No token → redirect to login from ${pathname}`);
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      const user = verifyTokenSync(token);

      if (!user) {
        console.log('[Middleware] Invalid token → clear & redirect');
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }

      if (user.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', String(user.id));
      requestHeaders.set('x-user-role', user.role);
      requestHeaders.set('x-user-email', user.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('[Middleware] Error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};