import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/feed"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*"],
};
