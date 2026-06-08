import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getDomainsMap } from "@/lib/tenants"

export const dynamic = "force-dynamic"

export default async function RootPage() {
  const h = await headers()
  // Strip port in case it's included (e.g. localhost:3000)
  const host = (h.get("host") ?? "").split(":")[0]

  // Check if this host is a known tenant custom domain
  const domains = getDomainsMap()
  const tenantSlug = domains[host]

  if (tenantSlug) {
    // Serve the tenant landing page via redirect to /[slug]
    redirect(`/${tenantSlug}`)
  }

  // Default: Leadcom admin console
  redirect("/admin")
}
