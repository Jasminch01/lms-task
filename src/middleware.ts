import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtectedRoute = createRouteMatcher(["/course(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const accessToken = req.cookies.get("accessToken")?.value;
  console.log(accessToken);
  
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
