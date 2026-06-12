import { NextResponse, type NextRequest } from 'next/server';
import { APP_SESSION_COOKIE } from '@/lib/auth/app-session';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete(APP_SESSION_COOKIE);
  return response;
}
