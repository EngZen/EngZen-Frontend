import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { type Locale, routing } from "./i18n/routing";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/learning-path",
  "/vocabulary",
  "/flashcards",
  "/categories",
];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run i18n middleware first
  const response = intlMiddleware(request);

  // 2. Auth logic
  const token = request.cookies.get("access_token")?.value;

  // Create a helper to check paths regardless of locale
  const checkPath = (routes: string[]) => {
    return routes.some((route) => {
      // Check if it's a root match or starts with the route
      // Account for locale prefix like /en/dashboard or /vi/dashboard
      return (
        pathname === route ||
        pathname.startsWith(`${route}/`) ||
        routing.locales.some(
          (locale) =>
            pathname === `/${locale}${route}` ||
            pathname.startsWith(`/${locale}${route}/`),
        )
      );
    });
  };

  const isProtectedRoute =
    checkPath(PROTECTED_ROUTES) ||
    pathname === "/" ||
    routing.locales.includes(pathname.replace("/", "") as Locale);
  const isAuthRoute = checkPath(AUTH_ROUTES);

  if (isProtectedRoute && !token) {
    // Redirect to login with current locale
    const localeMatch = pathname.match(/^\/([^/]+)/);
    const locale =
      localeMatch && routing.locales.includes(localeMatch[1] as Locale)
        ? localeMatch[1]
        : routing.defaultLocale;

    const url = new URL(`/${locale}/login`, request.url);
    if (
      pathname !== "/" &&
      !routing.locales.includes(pathname.replace("/", "") as Locale)
    ) {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  if (
    (isAuthRoute ||
      pathname === "/" ||
      routing.locales.includes(pathname.replace("/", "") as Locale)) &&
    token
  ) {
    const localeMatch = pathname.match(/^\/([^/]+)/);
    const locale =
      localeMatch && routing.locales.includes(localeMatch[1] as Locale)
        ? localeMatch[1]
        : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Static files
    // - _next
    "/((?!api|_next|.*\\..*).*)",
  ],
};
