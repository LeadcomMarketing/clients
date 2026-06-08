import "server-only"
import fs from 'fs'
import path from 'path'
import type { TenantConfig, TenantMeta } from './tenant-types'
import { commitFilesToGithub } from './github-sync'

// Static registry — bundled at build time by Turbopack/webpack.
// On Vercel (read-only filesystem), this is the ONLY source that works.
// Locally, we fall back to the filesystem for hot-reload support.
import { tenantRegistry } from '../tenants/index'

const DIR = path.join(process.cwd(), 'tenants')

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })
}

// ── Read ──────────────────────────────────────────────────────────
// Strategy: try the static registry first (bundled at build time, works on
// Vercel where the filesystem may not have the files). Fall back to the
// filesystem for local dev and hot-reload. No env var dependency.

export function getTenant(slug: string): TenantConfig | null {
  // 1. Static registry (bundled — always works on Vercel)
  const fromRegistry = tenantRegistry[slug] as TenantConfig | undefined
  if (fromRegistry) return fromRegistry

  // 2. Filesystem fallback (local dev / edge cases)
  try {
    const file = path.join(DIR, `${slug}.json`)
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8')) as TenantConfig
  } catch {}
  return null
}

export function getAllTenants(): TenantConfig[] {
  // 1. Registry has data — use it
  const fromRegistry = Object.values(tenantRegistry) as TenantConfig[]
  if (fromRegistry.length > 0) {
    return fromRegistry.sort((a, b) => a.clinicName.localeCompare(b.clinicName))
  }

  // 2. Filesystem fallback
  try {
    ensureDir()
    return fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
      .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8')) as TenantConfig)
      .sort((a, b) => a.clinicName.localeCompare(b.clinicName))
  } catch {
    return []
  }
}

export function getTenantMetas(): TenantMeta[] {
  return getAllTenants().map(({ slug, clinicName, clinicCity, customDomain, createdAt }) => ({
    slug,
    clinicName,
    clinicCity,
    customDomain,
    createdAt,
  }))
}

export function slugExists(slug: string): boolean {
  if (slug in tenantRegistry) return true
  return fs.existsSync(path.join(DIR, `${slug}.json`))
}

// ── Write ─────────────────────────────────────────────────────────
// Builds all content in memory first, then:
//   1. Writes to filesystem (local dev hot-reload)
//   2. Commits to GitHub (Vercel — triggers redeploy with new static registry)
// On Vercel the filesystem is read-only so step 1 silently fails; step 2 is what matters.

export async function saveTenant(config: TenantConfig): Promise<void> {
  const tenantContent = JSON.stringify(config, null, 2)

  // Merge into existing registry (works with in-memory data on Vercel)
  const currentTenants: Record<string, TenantConfig> = Object.fromEntries(
    Object.entries(tenantRegistry).map(([k, v]) => [k, v as TenantConfig])
  )
  const updatedTenants = { ...currentTenants, [config.slug]: config }

  const registryContent = _buildRegistryContent(updatedTenants)
  const domainsMap      = _buildDomainsMap(updatedTenants)
  const domainsContent  = JSON.stringify(domainsMap, null, 2)

  // 1. Filesystem write (local dev)
  try {
    ensureDir()
    fs.writeFileSync(path.join(DIR, `${config.slug}.json`), tenantContent)
    fs.writeFileSync(path.join(DIR, 'index.ts'), registryContent)
    fs.writeFileSync(path.join(DIR, '_domains.json'), domainsContent)
  } catch { /* read-only on Vercel — step 2 handles persistence */ }

  // 2. GitHub commit → triggers Vercel redeploy
  const hasGithub = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)
  if (hasGithub) {
    await commitFilesToGithub([
      { path: `tenants/${config.slug}.json`, content: tenantContent },
      { path: 'tenants/index.ts',            content: registryContent },
      { path: 'tenants/_domains.json',       content: domainsContent },
    ], `chore: update tenant ${config.clinicName} via admin`)
  } else if (!fs.existsSync(path.join(DIR, `${config.slug}.json`))) {
    throw new Error('GITHUB_TOKEN not configured — add it to Vercel environment variables so admin saves can persist.')
  }

  _syncVercelEnv(domainsMap).catch(err => console.warn('[tenants]', err.message))
}

export async function deleteTenant(slug: string): Promise<void> {
  const clinicName = getTenant(slug)?.clinicName ?? slug

  const currentTenants: Record<string, TenantConfig> = Object.fromEntries(
    Object.entries(tenantRegistry)
      .filter(([k]) => k !== slug)
      .map(([k, v]) => [k, v as TenantConfig])
  )

  const registryContent = _buildRegistryContent(currentTenants)
  const domainsMap      = _buildDomainsMap(currentTenants)
  const domainsContent  = JSON.stringify(domainsMap, null, 2)

  try {
    const file = path.join(DIR, `${slug}.json`)
    if (fs.existsSync(file)) fs.unlinkSync(file)
    fs.writeFileSync(path.join(DIR, 'index.ts'), registryContent)
    fs.writeFileSync(path.join(DIR, '_domains.json'), domainsContent)
  } catch { /* read-only on Vercel */ }

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await commitFilesToGithub([
      { path: 'tenants/index.ts',      content: registryContent },
      { path: 'tenants/_domains.json', content: domainsContent },
    ], `chore: remove tenant ${clinicName} via admin`)
  }

  _syncVercelEnv(domainsMap).catch(err => console.warn('[tenants]', err.message))
}

// ── In-memory content builders ────────────────────────────────────

function _slugToIdentifier(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

function _buildRegistryContent(tenants: Record<string, TenantConfig>): string {
  const slugs = Object.keys(tenants).sort()
  const lines = [
    '// AUTO-GENERATED — rebuilt automatically by saveTenant() / deleteTenant()',
    '// Do not edit manually. Commit this file whenever tenants are added or removed.',
    '// On Vercel, these static imports are bundled at build time, making tenant',
    '// data available without filesystem access at runtime.',
    '/* eslint-disable */',
    '',
    ...slugs.map(s => `import ${_slugToIdentifier(s)} from './${s}.json'`),
    '',
    'export const tenantRegistry: Record<string, object> = {',
    ...slugs.map(s => `  '${s}': ${_slugToIdentifier(s)},`),
    '}',
    '',
  ]
  return lines.join('\n')
}

function _buildDomainsMap(tenants: Record<string, TenantConfig>): DomainsMap {
  const map: DomainsMap = {}
  for (const t of Object.values(tenants)) {
    if (t.customDomain?.trim()) map[t.customDomain.trim()] = t.slug
  }
  return map
}

// Legacy filesystem rebuilders (used locally when filesystem is writable)
function _rebuildRegistry(): void {
  const tenants = Object.fromEntries(
    getAllTenants().map(t => [t.slug, t])
  )
  fs.writeFileSync(path.join(DIR, 'index.ts'), _buildRegistryContent(tenants))
}

// ── Domain map ────────────────────────────────────────────────────

export type DomainsMap = Record<string, string>

export function getDomainsMap(): DomainsMap {
  const file = path.join(DIR, '_domains.json')
  if (!fs.existsSync(file)) return {}
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function _rebuildDomainsMap(): void {
  const map: DomainsMap = {}
  for (const t of getAllTenants()) {
    if (t.customDomain?.trim()) map[t.customDomain.trim()] = t.slug
  }
  fs.writeFileSync(path.join(DIR, '_domains.json'), JSON.stringify(map, null, 2))
}

async function _syncVercelEnv(map: DomainsMap): Promise<void> {
  const token     = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId    = process.env.VERCEL_TEAM_ID

  if (!token || !projectId) return

  const base = 'https://api.vercel.com'
  const qs   = teamId ? `?teamId=${teamId}` : ''
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const value = JSON.stringify(map)

  const envRes = await fetch(`${base}/v9/projects/${projectId}/env${qs}`, {
    method: 'POST',
    headers,
    body: JSON.stringify([
      { key: 'TENANT_DOMAINS', value, type: 'plain', target: ['production', 'preview', 'development'] },
    ]),
  })

  if (envRes.status === 409) {
    const list = await fetch(`${base}/v9/projects/${projectId}/env${qs}`, { headers })
    const { envs } = await list.json() as { envs: { id: string; key: string }[] }
    const existing = envs.find((e) => e.key === 'TENANT_DOMAINS')
    if (existing) {
      await fetch(`${base}/v9/projects/${projectId}/env/${existing.id}${qs}`, {
        method: 'PATCH', headers, body: JSON.stringify({ value }),
      })
    }
  }

  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHook) {
    await fetch(deployHook, { method: 'POST' })
    console.log('[tenants] Vercel redeploy triggered')
  }
}
