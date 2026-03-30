import { auth } from "@/auth";

const publicPrefixes = ["/auth", "/waitlist", "/safety", "/demo"] as const;

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/api/waitlist")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  return publicPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    return undefined;
  }

  if (isPublicPath(pathname)) {
    return undefined;
  }

  if (!req.auth) {
    const signIn = new URL("/auth/signin", req.nextUrl.origin);
    signIn.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return Response.redirect(signIn);
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
