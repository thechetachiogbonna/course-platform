import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";
import { setUserCountryHeader } from "./lib/user-country-header";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)",
  "/api/webhooks/stripe(.*)",
  "/courses/:courseId",
  "/courses/:courseId/lessons/:lessonId",
  "/",
  "/products/:productId",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 2_000,
      interval: "1h",
      capacity: 5_000,
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  const decision = await aj.protect(
    process.env.TEST_IP_ADDRESS
      ? { ...req, ip: process.env.TEST_IP_ADDRESS, headers: req.headers }
      : req,
    {
      requested: 0,
    },
  );

  if (decision.isDenied()) {
    return new NextResponse(null, { status: 403 });
  }

  if (isAdminRoute(req)) {
    const user = await auth.protect();
    if (user.sessionClaims.role !== "admin") {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (!decision.ip.isVpn() && !decision.ip.isProxy()) {
    const headers = new Headers(req.headers);
    setUserCountryHeader(headers, decision.ip.country);

    return NextResponse.next({ request: { headers } });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
