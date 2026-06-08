import { redirect } from "next/navigation"
import { getTenantMetas } from "@/lib/tenants"

export default function RootPage() {
  // Redirect to the first tenant if one exists, otherwise to admin
  const tenants = getTenantMetas()
  if (tenants.length > 0) {
    redirect(`/${tenants[0].slug}`)
  }
  redirect("/admin")
}
