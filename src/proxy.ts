import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from './lib/rate-limiter';

const coreProxy = async (req: NextRequest): Promise<NextResponse> => {
  return NextResponse.next();
};

export const proxy = withRateLimit({
  windowMs: 10 * 1000, // 10 seconds sliding window
  maxRequests: 45, // Max 45 requests per 10 seconds per IP
  cleanupInterval: 10 * 1000, // Clean up every 10 seconds
})(coreProxy);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
