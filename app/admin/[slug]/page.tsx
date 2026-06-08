import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifySessionToken, ADMIN_COOKIE } from "@/lib/admin-auth"
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
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token || !verifySessionToken(token)) redirect("/admin/login")

  const { slug } = await params
  const config = getTenant(slug)
  if (!config) notFound()

  return <TenantEditForm initial={config} />
}
