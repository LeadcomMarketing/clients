import { NextRequest, NextResponse } from "next/server"

const ADMIN_COOKIE = "lc_admin"

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

export function proxy(req: NextRequest) {
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
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// No matcher config — proxy runs on all requests by default in Next.js 16
