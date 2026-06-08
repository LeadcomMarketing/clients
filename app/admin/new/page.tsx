import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/admin-auth"
import { TenantEditForm } from "@/components/admin/TenantEditForm"
import type { TenantConfig } from "@/lib/tenant-types"
import { EMPTY_TENANT } from "@/lib/tenant-types"

export const metadata = { title: "Ny klinik — Leadcom Admin" }

export default async function NewTenantPage() {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token || !verifySessionToken(token)) redirect("/admin/login")

  const blank: TenantConfig = {
    ...EMPTY_TENANT,
    slug: "",
    createdAt: new Date().toISOString(),
  }

  return <TenantEditForm initial={blank} isNew />
}
