import { NextRequest, NextResponse } from "next/server"
// Static JSON import — bundled at build/restart (Edge Runtime cannot use `fs`).
// When a custom domain is added via admin, this file is rewritten and the dev
// server hot-reloads it. In production a redeploy is needed (fine for agency cadence).
import domainsMap from "@/tenants/_domains.json"

const ADMIN_COOKIE = "lc_admin"
const DOMAINS: Record<string, string> = domainsMap as Record<string, string>
const PUBLIC_PATHS = ["/admin/login", "/api/admin/login", "/_next", "/favicon", "/images"]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

// ── Edge-compatible HMAC-SHA256 verification (Web Crypto API) ──────
// No Node `crypto` — uses the global `crypto.subtle` available in Edge Runtime.
function fromBase64url(str: string): string {
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"))
}

async function verifyAdminCookie(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_PASSWORD ?? "leadcom-dev-secret"
    const decoded = fromBase64url(token)
    const lastColon = decoded.lastIndexOf(":")
    if (lastColon === -1) return false

    const payload = decoded.slice(0, lastColon)
    const sigHex  = decoded.slice(lastColon + 1)

    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
    return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload))
  } catch {
    return false
  }
}

// ── Middleware ────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const bareHost = (req.headers.get("host") ?? "").split(":")[0]

  // 1. Custom domain → /[slug] rewrite
  const tenantSlug = DOMAINS[bareHost]
  if (tenantSlug && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone()
    url.pathname = `/${tenantSlug}${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

  // 2. Admin auth guard
  if (pathname.startsWith("/admin") && !isPublicPath(pathname)) {
    const token = req.cookies.get(ADMIN_COOKIE)?.value
    if (!token || !(await verifyAdminCookie(token))) {
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
