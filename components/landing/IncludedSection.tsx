import type { TenantConfig } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

function IconSearch() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="var(--brand)" strokeWidth="1.8"/><path d="M15.5 15.5L20 20" stroke="var(--accent-warm)" strokeWidth="2" strokeLinecap="round"/></svg>
}
function IconXray() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="var(--brand)" strokeWidth="1.8"/><path d="M7 9h10M7 12h6" stroke="var(--accent-warm)" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconCube() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L21 8v8l-9 5-9-5V8l9-5z" stroke="var(--brand)" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 3v13M21 8l-9 5-9-5" stroke="var(--accent-warm)" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconShield() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L4 6v6c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V6l-8-4z" stroke="var(--brand)" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="var(--accent-warm)" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function IconSparkle() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2.5" fill="var(--accent-warm)"/></svg>
}
function IconStar() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2z" stroke="var(--brand)" strokeWidth="1.6" strokeLinejoin="round" fill="var(--accent-warm-light, #FBF1EC)"/></svg>
}

const ICONS = [IconSearch, IconXray, IconCube, IconShield, IconSparkle, IconStar]

export default function IncludedSection({ config }: { config: TenantConfig }) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-center mb-3 text-balance tracking-tight leading-[1.1]" style={{ color: "var(--foreground, #1A1714)" }}>
          {config.includedTitle}
        </h2>
        <p className="text-center text-sm md:text-base mb-14 max-w-md mx-auto" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          Allt ingår i ett och samma besök — inga dolda avgifter, inga överraskningar.
        </p>

        <div className="relative">
          <div className="absolute left-[27px] top-5 bottom-5 w-px hidden sm:block" style={{ backgroundColor: "var(--border, #E5E0D9)" }} aria-hidden="true" />
          <div className="flex flex-col gap-5">
            {config.includedItems.map((item, i) => {
              const Icon = ICONS[i % ICONS.length]
              const isLast = i === config.includedItems.length - 1
              return (
                <div key={i} className="relative flex gap-5 items-start bg-white rounded-[1.5rem] p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.07)] border hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow duration-200" style={{ borderColor: "var(--border, #E5E0D9)" }}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: "var(--brand-light, #EEF2F7)" }}>
                    <Icon />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isLast && (
                        <span className="text-[10px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5" style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)", color: "var(--accent-warm)" }}>
                          Bonus
                        </span>
                      )}
                      <p className="font-bold text-sm md:text-base leading-snug" style={{ color: "var(--foreground, #1A1714)" }}>
                        {item.title}
                      </p>
                      {item.value && (
                        <span className="ml-auto text-[10px] font-bold rounded-full px-2.5 py-0.5 whitespace-nowrap" style={{ color: "var(--muted-foreground, #6B6460)", backgroundColor: "var(--secondary)" }}>
                          {item.value}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground, #6B6460)" }}>{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AirFlow callout */}
        {(config.airflowTitle || config.airflowBody) && (
          <div className="mt-10 rounded-[2rem] p-7 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.25)]" style={{ backgroundColor: "var(--brand)" }}>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 text-balance">
              {config.airflowTitle}
            </h3>
            <p className="leading-relaxed text-sm md:text-base text-white/70">
              {config.airflowBody}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <CtaButton size="lg" />
        </div>
      </div>
    </section>
  )
}
