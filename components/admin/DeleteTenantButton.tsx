"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteTenantButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/tenants/${slug}`, { method: "DELETE" })
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-950 rounded-lg px-2.5 py-2 transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Ja, radera"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg px-2.5 py-2 transition-colors"
        >
          Avbryt
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center justify-center w-9 h-9 text-slate-500 hover:text-red-400 bg-slate-800 hover:bg-red-950/50 rounded-xl transition-colors"
      title={`Radera ${name}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
    </button>
  )
}
