import { NextRequest, NextResponse } from "next/server"
import { getTenant, saveTenant, deleteTenant } from "@/lib/tenants"

interface Ctx { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  const config = getTenant(slug)
  if (!config) return NextResponse.json({ error: "not found" }, { status: 404 })
  return NextResponse.json(config)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  const existing = getTenant(slug)
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 })

  const body = await req.json()
  const updated = { ...existing, ...body, slug, createdAt: existing.createdAt }
  saveTenant(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  if (!getTenant(slug)) return NextResponse.json({ error: "not found" }, { status: 404 })
  deleteTenant(slug)
  return NextResponse.json({ ok: true })
}
