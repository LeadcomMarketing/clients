"use client"

import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
      </svg>
      Logga ut
    </button>
  )
}
