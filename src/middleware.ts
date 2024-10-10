export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
    // Always run for API routes
    "/admin",
    "/teacher",
    "/student",
    "/parent",
    "/list/:resource+",
  ],
};
