import { NextRequest, NextResponse } from "next/server"
import { checkPassword, createSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Fel lösenord" }, { status: 401 })
  }

  const token = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  })
  return res
}
