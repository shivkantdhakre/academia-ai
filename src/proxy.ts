import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // Route protection rules:
  const isAuthPage = url.pathname === '/login' || url.pathname.startsWith('/auth/');
  const isPublicPage = url.pathname === '/'; // Allow public access to landing page
  const isWebhook = url.pathname.startsWith('/api/webhooks/'); // Ensure Stripe/Razorpay webhooks aren't blocked

  // If no user, and they are trying to access a protected route
  if (!user && !isAuthPage && !isPublicPage && !isWebhook) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in, skip the login/landing pages and go straight to the app
  if (user && (url.pathname === '/login' || url.pathname === '/')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
