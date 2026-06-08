import type { TenantConfig } from "@/lib/tenant-types"
import { ATB_DISCLAIMER } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

export default function BottomCta({ config }: { config: TenantConfig }) {
  return (
    <section className="py-14 md:py-20" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "var(--accent-warm)" }}>
          {config.bottomCtaSubtitle}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-extrabold mb-3 text-balance tracking-tight leading-[1.15]" style={{ color: "var(--foreground, #1A1714)" }}>
          {config.bottomCtaTitle}
        </h2>

        <div className="flex items-center justify-center gap-4 my-7">
          <span className="text-base line-through font-medium" style={{ color: "var(--muted-foreground, #6B6460)" }}>{config.originalPrice}</span>
          <div className="relative inline-block">
            <span className="text-[2.75rem] font-extrabold leading-none" style={{ color: "var(--brand)" }}>
              {config.discountedPrice}
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 130 14" fill="none" aria-hidden="true">
              <path d="M2,10 C30,4 65,3 98,7 C109,8.5 120,10 128,8.5"
                stroke="var(--accent-warm)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M6,12 C35,8 70,7.5 102,10 C112,11 121,11.5 127,10.5"
                stroke="var(--accent-warm)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
            </svg>
          </div>
        </div>

        <CtaButton size="lg" label={config.ctaLabels?.bottom || config.ctaText} />
        <p className="text-xs mt-3" style={{ color: "var(--muted-foreground, #6B6460)" }}>{config.ctaSubtext}</p>
        {config.showAtbDisclaimer && (
          <p className="text-[11px] leading-relaxed mt-3 max-w-md mx-auto" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.7 }}>
            * {ATB_DISCLAIMER}
          </p>
        )}
      </div>
    </section>
  )
}
