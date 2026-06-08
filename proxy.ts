import { NextRequest, NextResponse } from "next/server"

// ── Constants ─────────────────────────────────────────────────────
const ADMIN_COOKIE = "lc_admin"

// Domain map from env var — fully Edge-compatible, no file I/O, no crypto.
// Set TENANT_DOMAINS in Vercel: '{"tessindental.se":"tessin-dental"}'
const DOMAINS: Record<string, string> = (() => {
  try {
    return JSON.parse(process.env.TENANT_DOMAINS ?? "{}") as Record<string, string>
  } catch {
    return {}
  }
})()

const PUBLIC_PATHS = ["/admin/login", "/api/admin/login", "/_next", "/favicon"]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

// ── Proxy (replaces deprecated middleware.ts in Next.js 16) ───────
// Fully synchronous — no crypto, no async.
// Cookie PRESENCE checked here for fast redirect UX.
// Full HMAC token verification happens in app/admin/layout.tsx (Node.js).

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const bareHost = (req.headers.get("host") ?? "").split(":")[0]

  // 1. Custom domain → /[slug] rewrite
  const tenantSlug = DOMAINS[bareHost]
  if (tenantSlug && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone()
    url.pathname = `/${tenantSlug}${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

  // 2. Admin: redirect to login if no cookie present
  if (pathname.startsWith("/admin") && !isPublicPath(pathname)) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|public/).*)",],
}
