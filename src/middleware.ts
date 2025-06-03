import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/recipes(.*)',
  '/api/conversions(.*)',
  '/api/subscription(.*)',
  '/api/user(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  try {
    // Allow public routes
    if (isPublicRoute(request)) {
      return NextResponse.next();
    }

    // Protect dashboard routes
    if (isProtectedRoute(request)) {
      const { userId } = await auth();
      if (!userId) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect_url', request.url);
        return NextResponse.redirect(signInUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In development, allow access
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    // In production, redirect to sign-in on error
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};