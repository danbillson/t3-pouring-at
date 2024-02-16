import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["((?!^/admin/).*)"],
  afterAuth(auth, req, _evt) {
    const user = auth.user;

    if (
      req.nextUrl.pathname === "/admin" &&
      user?.privateMetadata?.role !== "admin"
    ) {
      return NextResponse.redirect("/");
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
