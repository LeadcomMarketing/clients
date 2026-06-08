/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Tell Next.js to bundle the tenants/ and leads/ directories into every
  // serverless function so fs.readFileSync can access them on Vercel at runtime.
  outputFileTracingIncludes: {
    "/**": ["./tenants/**", "./leads/**"],
  },
}

export default nextConfig
