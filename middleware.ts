import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow auth routes
    if (pathname.startsWith('/auth')) {
      return NextResponse.next();
    }

    // Check for admin routes
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return new NextResponse(null, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/upload/:path*',
    '/admin/:path*',
    '/history/:path*',
  ],
};