import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read domain→slug mapping committed to git by saveTenant()
// Runs at BUILD TIME in Node.js — no Edge Runtime, no crashes
let domainsMap = {}
try {
  const raw = readFileSync(join(__dirname, 'tenants', '_domains.json'), 'utf-8')
  domainsMap = JSON.parse(raw)
} catch {}

// Generate rewrite rules: www.tessindentalsthln.se → /tessin-dental
const domainRewrites = Object.entries(domainsMap).flatMap(([domain, slug]) => [
  { source: '/',        has: [{ type: 'host', value: domain }], destination: `/${slug}` },
  { source: '/:path+',  has: [{ type: 'host', value: domain }], destination: `/${slug}/:path*` },
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return domainRewrites
  },
}

export default nextConfig
