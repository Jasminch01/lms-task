import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const requestedPath = req.nextUrl.pathname; // Get the current requested path

  if (!token) {
    // Redirect to login with callbackUrl to store where the user wanted to go
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the user to access the requested page if they have a token
  return NextResponse.next();
}

export const config = {
  matcher: ["/course/:path*"],
};
