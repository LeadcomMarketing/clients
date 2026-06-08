import { getAllTenants, getTenant } from "@/lib/tenants"
import { tenantRegistry } from "@/tenants/index"

export const dynamic = "force-dynamic"

export function GET() {
  const registryKeys   = Object.keys(tenantRegistry)
  const hagaFromReg    = !!tenantRegistry['haga-tandlakeri']
  const tessinFromReg  = !!tenantRegistry['tessin-dental']
  const hagaFull       = getTenant('haga-tandlakeri')
  const tessinFull     = getTenant('tessin-dental')
  const allTenants     = getAllTenants()

  return Response.json({
    registryKeys,
    hagaFromReg,
    tessinFromReg,
    getTenantHaga:   !!hagaFull,
    getTenantTessin: !!tessinFull,
    allTenantsCount: allTenants.length,
    isVercel: !!process.env.VERCEL,
    cwd: process.cwd(),
  })
}
