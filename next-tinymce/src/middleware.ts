import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard'] };

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');
  // console.log('sessionToken', sessionToken, req.cookies.get('next-auth.session-token'), req.cookies.get('__Secure-next-auth.session-token'));
  if (!sessionToken && req.url.includes('/dashboard')) {
    console.log('No token found, redirecting to login page');
    console.log('req.url', req.url, req);
    return NextResponse.redirect(req.nextUrl.origin +'/login');
  }
  return NextResponse.next();
}
