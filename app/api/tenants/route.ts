import { NextRequest, NextResponse } from "next/server"
import { getAllTenants, saveTenant, slugExists } from "@/lib/tenants"
import { EMPTY_TENANT } from "@/lib/tenant-types"

export async function GET() {
  const tenants = getAllTenants()
  return NextResponse.json(tenants)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")

  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 })
  if (slugExists(slug)) return NextResponse.json({ error: "slug already exists" }, { status: 409 })

  const config = {
    ...EMPTY_TENANT,
    ...body,
    slug,
    createdAt: new Date().toISOString(),
  }

  saveTenant(config)
  return NextResponse.json(config, { status: 201 })
}
