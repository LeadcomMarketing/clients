import { getAllTenants } from "@/lib/tenants"
import { tenantRegistry } from "@/tenants/index"

export const dynamic = "force-dynamic"

export function GET() {
  let tenants: { slug: string; name: string }[] = []
  let error: string | null = null

  try {
    tenants = getAllTenants().map((t) => ({ slug: t.slug, name: t.clinicName }))
  } catch (e) {
    error = String(e)
  }

  return Response.json({
    ok: tenants.length > 0,
    isVercel: !!process.env.VERCEL,
    registryKeys: Object.keys(tenantRegistry),
    tenants,
    error,
    cwd: process.cwd(),
  })
}
