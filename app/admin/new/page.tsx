import { TenantEditForm } from "@/components/admin/TenantEditForm"
import type { TenantConfig } from "@/lib/tenant-types"
import { EMPTY_TENANT } from "@/lib/tenant-types"

export const metadata = { title: "Ny klinik — Leadcom Admin" }

const BLANK: TenantConfig = {
  ...EMPTY_TENANT,
  slug: "",
  createdAt: new Date().toISOString(),
}

export default function NewTenantPage() {
  return <TenantEditForm initial={BLANK} isNew />
}
