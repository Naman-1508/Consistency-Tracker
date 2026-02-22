import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Basic in-memory store for rate limiting (Note: clears on Vercel serverless reboot)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_COUNT = 30; // 30 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function middleware(req: NextRequest) {
    // 1. Rate Limiting for all API routes
    if (req.nextUrl.pathname.startsWith("/api")) {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const currentTime = Date.now();
        const rateLimitInfo = rateLimitMap.get(ip);

        if (rateLimitInfo) {
            if (currentTime - rateLimitInfo.windowStart > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.set(ip, { count: 1, windowStart: currentTime });
            } else {
                rateLimitInfo.count++;
                if (rateLimitInfo.count > RATE_LIMIT_COUNT) {
                    return new NextResponse(
                        JSON.stringify({ error: "Too many requests. Please try again later." }),
                        { status: 429, headers: { "Content-Type": "application/json" } }
                    );
                }
            }
        } else {
            rateLimitMap.set(ip, { count: 1, windowStart: currentTime });
        }
    }

    // 2. NextAuth Authentication for Protected Routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        const token = await getToken({ req });
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Run middleware on API routes and Dashboard
    matcher: ["/api/:path*", "/dashboard/:path*"],
};
