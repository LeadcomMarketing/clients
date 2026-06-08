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

// ── Domain map (read by middleware) ───────────────────────────────

/** { "haga-tandlakeri.se": "haga-tandlakeri" } */
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
