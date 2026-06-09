import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getTenant } from "@/lib/tenants"

interface Ctx { params: Promise<{ slug: string }> }

const LEADS_DIR = path.join(process.cwd(), "leads")

function leadsFile(slug: string) {
  return path.join(LEADS_DIR, `${slug}.json`)
}

function readLeads(slug: string): object[] {
  const file = leadsFile(slug)
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, "utf-8"))
}

// POST /api/tenants/[slug]/leads — save a new opt-in
export async function POST(req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  if (!getTenant(slug)) return NextResponse.json({ error: "not found" }, { status: 404 })

  const { name, email, phone } = await req.json()
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "name, email and phone are required" }, { status: 400 })
  }

  const lead = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone).trim(),
    createdAt: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    userAgent: req.headers.get("user-agent") ?? "",
  }

  // ── Save locally (no-op on Vercel's read-only fs — fails silently) ──
  try {
    fs.mkdirSync(LEADS_DIR, { recursive: true })
    const leads = readLeads(slug)
    leads.unshift(lead)
    fs.writeFileSync(leadsFile(slug), JSON.stringify(leads, null, 2))
  } catch { /* read-only on Vercel — webhook below still fires */ }

  // ── Forward to Make.com webhook (fire-and-forget) ─────────────
  const tenant = getTenant(slug)
  const webhookUrl = tenant?.integrations.makeWebhookUrl?.trim()
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:      lead.name,
          email:     lead.email,
          phone:     lead.phone,
          clinic:    tenant.clinicName,
          slug,
          createdAt: lead.createdAt,
          leadId:    lead.id,
        }),
      })
    } catch (err) {
      // Non-fatal — log but don't fail the request
      console.error(`[Make webhook] ${slug}:`, err)
    }
  }

  return NextResponse.json({ ok: true })
}

// GET /api/tenants/[slug]/leads — list leads (admin only, guarded by middleware)
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params
  if (!getTenant(slug)) return NextResponse.json({ error: "not found" }, { status: 404 })
  return NextResponse.json(readLeads(slug))
}
