/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Bundle tenants/ into every serverless function so fs.readFileSync works on Vercel.
  // Listed per-route because Turbopack doesn't support glob keys like "/**".
  outputFileTracingIncludes: {
    "/":                         ["./tenants/**/*"],
    "/[tenant]":                 ["./tenants/**/*"],
    "/admin":                    ["./tenants/**/*"],
    "/admin/[slug]":             ["./tenants/**/*"],
    "/admin/new":                ["./tenants/**/*"],
    "/api/tenants":              ["./tenants/**/*"],
    "/api/tenants/[slug]":       ["./tenants/**/*"],
    "/api/tenants/[slug]/leads": ["./tenants/**/*"],
    "/api/tenants/[slug]/upload":["./tenants/**/*"],
  },
}

export default nextConfig
