"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push(searchParams.get("from") ?? "/admin")
    } else {
      const data = await res.json()
      setError(data.error ?? "Något gick fel")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-600 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Leadcom Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Tenant Management Console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors"
          >
            {loading ? "Loggar in…" : "Logga in"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Sätt <code className="text-slate-500">ADMIN_PASSWORD</code> i .env.local
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
