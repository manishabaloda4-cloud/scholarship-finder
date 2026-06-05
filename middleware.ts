import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const user = req.cookies.get("sf_user");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApi = req.nextUrl.pathname.startsWith("/api");

  if (isApi || isLoginPage) return NextResponse.next();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/results", "/tracker"],
};