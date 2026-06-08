import { notFound } from "next/navigation"
import { getTenant } from "@/lib/tenants"
import { TenantEditForm } from "@/components/admin/TenantEditForm"

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const config = getTenant(slug)
  return { title: config ? `${config.clinicName} — Leadcom Admin` : "Leadcom Admin" }
}

export const dynamic = "force-dynamic"

export default async function EditTenantPage({ params }: Props) {
  const { slug } = await params
  const config = getTenant(slug)
  if (!config) notFound()

  return <TenantEditForm initial={config} />
}
