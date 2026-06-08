import fs from 'fs'
import path from 'path'
import type { TenantConfig, TenantMeta } from './tenant-types'

const DIR = path.join(process.cwd(), 'tenants')

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })
}

// ── Read ──────────────────────────────────────────────────────────

export function getTenant(slug: string): TenantConfig | null {
  ensureDir()
  const file = path.join(DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as TenantConfig
}

export function getAllTenants(): TenantConfig[] {
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
  return fs.existsSync(path.join(DIR, `${slug}.json`))
}

// ── Write ─────────────────────────────────────────────────────────

export function saveTenant(config: TenantConfig): void {
  ensureDir()
  fs.writeFileSync(path.join(DIR, `${config.slug}.json`), JSON.stringify(config, null, 2))
  _rebuildDomainsMap()
}

export function deleteTenant(slug: string): void {
  const file = path.join(DIR, `${slug}.json`)
  if (fs.existsSync(file)) fs.unlinkSync(file)
  _rebuildDomainsMap()
}

// ── Domain map ────────────────────────────────────────────────────
// Kept as a local JSON file for dev + as a Vercel env var for production.
// The middleware reads from TENANT_DOMAINS env var (Edge-compatible).
// This function keeps both in sync and optionally triggers a Vercel redeploy.

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

  // 1. Write local file (used by dev server hot-reload)
  fs.writeFileSync(path.join(DIR, '_domains.json'), JSON.stringify(map, null, 2))

  // 2. Push to Vercel env var + trigger redeploy (production)
  //    Requires VERCEL_TOKEN and VERCEL_PROJECT_ID in env
  _syncVercelEnv(map).catch((err) =>
    console.warn('[tenants] Vercel env sync skipped:', err.message)
  )
}

async function _syncVercelEnv(map: DomainsMap): Promise<void> {
  const token     = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId    = process.env.VERCEL_TEAM_ID // optional

  if (!token || !projectId) return // silently skip in dev

  const base = 'https://api.vercel.com'
  const qs   = teamId ? `?teamId=${teamId}` : ''
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const value = JSON.stringify(map)

  // Upsert the TENANT_DOMAINS env var on all environments
  const envRes = await fetch(`${base}/v9/projects/${projectId}/env${qs}`, {
    method: 'POST',
    headers,
    body: JSON.stringify([
      { key: 'TENANT_DOMAINS', value, type: 'plain', target: ['production', 'preview', 'development'] },
    ]),
  })

  // 409 = already exists → PATCH instead
  if (envRes.status === 409) {
    const list = await fetch(`${base}/v9/projects/${projectId}/env${qs}`, { headers })
    const { envs } = await list.json() as { envs: { id: string; key: string }[] }
    const existing = envs.find((e) => e.key === 'TENANT_DOMAINS')
    if (existing) {
      await fetch(`${base}/v9/projects/${projectId}/env/${existing.id}${qs}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ value }),
      })
    }
  }

  // Trigger a fresh production deployment
  const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHook) {
    await fetch(deployHook, { method: 'POST' })
    console.log('[tenants] Vercel redeploy triggered for new domain map')
  }
}
