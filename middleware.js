// middleware.js
import { NextResponse } from 'next/server';
import { verifyTokenSync } from './src/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk path login
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // Hanya jalankan untuk path /admin
  if (pathname.startsWith('/admin')) {
    try {
      // Ambil token dari cookie (konsisten 'auth_token')
      const token = request.cookies.get('auth_token')?.value;

      console.log(`[Middleware] ${pathname} → token exists? ${!!token}`);
      if (token) {
        console.log(`[Middleware] token preview: ${token.substring(0, 20)}...`);
      } else {
        // Coba manual parse header (fallback debug)
        const cookieHeader = request.headers.get('cookie') || '';
        console.log(`[Middleware] Raw cookie header: ${cookieHeader}`);
      }

      if (!token) {
        console.log(`[Middleware] No token → redirect to login from ${pathname}`);
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Verify token (sync version aman untuk middleware)
      const user = verifyTokenSync(token);

      if (!user) {
        console.log('[Middleware] Invalid token → clear & redirect');
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        // Clear invalid cookie
        response.cookies.delete('auth_token');
        return response;
      }

      if (user.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Forward user info ke headers
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
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};