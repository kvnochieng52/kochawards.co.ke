import { NextRequest, NextResponse } from 'next/server';

// While the voting programme is paused, every public URL funnels to the
// BOMA BORA page. Admin, API and static assets are untouched.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const allowed =
    pathname === '/boma-bora' ||
    pathname.startsWith('/boma-bora/') ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/library' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api');

  if (!allowed) {
    const url = req.nextUrl.clone();
    url.pathname = '/boma-bora';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on every path EXCEPT Next internals and common static files.
    '/((?!_next/|favicon|icon|apple-icon|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
