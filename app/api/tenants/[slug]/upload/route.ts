import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getTenant } from "@/lib/tenants"

interface Ctx { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  if (!getTenant(slug)) return NextResponse.json({ error: "tenant not found" }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Sanitise filename
  const ext = path.extname(file.name).toLowerCase() || ".jpg"
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"]
  if (!allowed.includes(ext)) return NextResponse.json({ error: "invalid file type" }, { status: 400 })

  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`
  const dir = path.join(process.cwd(), "public", "tenants", slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, filename), buffer)

  const url = `/tenants/${slug}/${filename}`
  return NextResponse.json({ url })

  /*
   * Production note — Vercel has an ephemeral filesystem.
   * To persist uploads, install @vercel/blob and replace the block above with:
   *
   * import { put } from "@vercel/blob"
   * const blob = await put(`tenants/${slug}/${filename}`, buffer, { access: "public" })
   * return NextResponse.json({ url: blob.url })
   *
   * Then set BLOB_READ_WRITE_TOKEN in your Vercel project env vars.
   */
}
