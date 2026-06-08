import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"

export default function NoObligationSection({ config }: { config: TenantConfig }) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="relative rounded-[2rem] overflow-hidden aspect-square md:aspect-auto md:h-80 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
            {config.heroImageUrl ? (
              <Image src={config.heroImageUrl} alt={config.clinicName} fill className="object-cover object-center" />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: "var(--brand-light, #EEF2F7)" }} />
            )}
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6" style={{ backgroundColor: "var(--brand-light, #EEF2F7)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L4 6v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V6l-8-4z" stroke="var(--brand)" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="var(--accent-warm)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-extrabold mb-4 text-balance tracking-tight leading-[1.15]" style={{ color: "var(--foreground, #1A1714)" }}>
              {config.noObligationTitle}
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--muted-foreground, #6B6460)" }}>
              {config.noObligationBody}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
