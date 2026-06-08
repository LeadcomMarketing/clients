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
const ON_VERCEL = !!process.env.VERCEL

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })
}

// ── Read ──────────────────────────────────────────────────────────

export function getTenant(slug: string): TenantConfig | null {
  if (ON_VERCEL) {
    return (tenantRegistry[slug] as TenantConfig) ?? null
  }
  ensureDir()
  const file = path.join(DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as TenantConfig
}

export function getAllTenants(): TenantConfig[] {
  if (ON_VERCEL) {
    return (Object.values(tenantRegistry) as TenantConfig[])
      .sort((a, b) => a.clinicName.localeCompare(b.clinicName))
  }
  ensureDir()
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf-8')) as TenantConfig)
    .sort((a, b) => a.clinicName.localeCompare(b.clinicName))
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
  if (ON_VERCEL) return slug in tenantRegistry
  return fs.existsSync(path.join(DIR, `${slug}.json`))
}

// ── Write (local dev only — Vercel filesystem is read-only) ────────

export async function saveTenant(config: TenantConfig): Promise<void> {
  ensureDir()
  fs.writeFileSync(path.join(DIR, `${config.slug}.json`), JSON.stringify(config, null, 2))
  _rebuildRegistry()
  _rebuildDomainsMap()

  const registryContent  = fs.readFileSync(path.join(DIR, 'index.ts'), 'utf-8')
  const tenantContent    = JSON.stringify(config, null, 2)
  const domainsContent   = JSON.stringify(getDomainsMap(), null, 2)

  // Commit all changed files to GitHub in a single commit → triggers Vercel redeploy
  await commitFilesToGithub([
    { path: `tenants/${config.slug}.json`, content: tenantContent },
    { path: 'tenants/index.ts',            content: registryContent },
    { path: 'tenants/_domains.json',       content: domainsContent },
  ], `chore: update tenant ${config.clinicName} via admin`)

  _syncVercelEnv(getDomainsMap()).catch((err) =>
    console.warn('[tenants] Vercel env sync skipped:', err.message)
  )
}

export async function deleteTenant(slug: string): Promise<void> {
  const file = path.join(DIR, `${slug}.json`)
  const clinicName = getTenant(slug)?.clinicName ?? slug
  if (fs.existsSync(file)) fs.unlinkSync(file)
  _rebuildRegistry()
  _rebuildDomainsMap()

  const registryContent = fs.readFileSync(path.join(DIR, 'index.ts'), 'utf-8')
  const domainsContent  = JSON.stringify(getDomainsMap(), null, 2)

  await commitFilesToGithub([
    { path: 'tenants/index.ts',      content: registryContent },
    { path: 'tenants/_domains.json', content: domainsContent },
  ], `chore: remove tenant ${clinicName} via admin`)

  _syncVercelEnv(getDomainsMap()).catch((err) =>
    console.warn('[tenants] Vercel env sync skipped:', err.message)
  )
}

// ── Registry (auto-generated static imports for Vercel) ───────────

function _slugToIdentifier(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

function _rebuildRegistry(): void {
  const tenants = getAllTenants()

  const lines = [
    '// AUTO-GENERATED — rebuilt automatically by saveTenant() / deleteTenant()',
    '// Do not edit manually. Commit this file whenever tenants are added or removed.',
    '// On Vercel, these static imports are bundled at build time, making tenant',
    '// data available without filesystem access at runtime.',
    '/* eslint-disable */',
    '',
  ]

  for (const t of tenants) {
    lines.push(`import ${_slugToIdentifier(t.slug)} from './${t.slug}.json'`)
  }

  lines.push('')
  lines.push('export const tenantRegistry: Record<string, object> = {')
  for (const t of tenants) {
    lines.push(`  '${t.slug}': ${_slugToIdentifier(t.slug)},`)
  }
  lines.push('}')
  lines.push('')

  fs.writeFileSync(path.join(DIR, 'index.ts'), lines.join('\n'))
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
