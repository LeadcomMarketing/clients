import Link from "next/link"
import { getTenantMetas } from "@/lib/tenants"
import { DeleteTenantButton } from "@/components/admin/DeleteTenantButton"

export const dynamic = "force-dynamic"

export default function AdminDashboard() {
  const tenants = getTenantMetas()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Kliniker</h1>
          <p className="text-sm text-slate-400 mt-1">{tenants.length} aktiva kliniker</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Ny klinik
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <svg className="mx-auto mb-4 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <p className="font-semibold">Inga kliniker ännu</p>
          <p className="text-sm mt-1">Klicka på &ldquo;Ny klinik&rdquo; för att lägga till den första.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((t) => (
            <div key={t.slug} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{t.clinicName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.clinicCity}</p>
                </div>
                <span className="flex-shrink-0 text-[10px] font-mono bg-slate-800 text-slate-400 rounded-lg px-2 py-1">
                  /{t.slug}
                </span>
              </div>

              {t.customDomain && (
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 flex-shrink-0" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span className="text-xs text-slate-300 truncate">{t.customDomain}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-800">
                <Link
                  href={`/admin/${t.slug}`}
                  className="flex-1 text-center text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl py-2 transition-colors"
                >
                  Redigera
                </Link>
                <Link
                  href={`/${t.slug}`}
                  target="_blank"
                  className="flex items-center justify-center w-9 h-9 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  title="Öppna landningssida"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                </Link>
                <DeleteTenantButton slug={t.slug} name={t.clinicName} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
