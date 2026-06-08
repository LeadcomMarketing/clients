import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"
import { ATB_DISCLAIMER } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

export default function HeroBanner({ config }: { config: TenantConfig }) {
  return (
    <section className="pt-6 pb-16 md:pt-10 md:pb-24" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-sm mb-7 self-center md:self-start" style={{ borderColor: "var(--border, #E5E0D9)" }}>
              <span className="flex text-yellow-400 text-sm leading-none" aria-hidden="true">★★★★★</span>
              <span className="text-xs font-semibold" style={{ color: "var(--brand)" }}>{config.trustBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance mb-5" style={{ color: "var(--foreground, #1A1714)" }}>
              {config.heroHeadline}
            </h1>

            <p className="text-base md:text-lg leading-relaxed mb-8 text-pretty max-w-md" style={{ color: "var(--muted-foreground, #6B6460)" }}>
              {config.heroSubheadline}
            </p>

            {/* Price lockup */}
            <div className="relative flex items-center gap-4 mb-8 self-center md:self-start">
              <span className="text-base line-through font-medium" style={{ color: "var(--muted-foreground, #6B6460)" }}>
                {config.originalPrice}
              </span>
              <div className="relative inline-block">
                <span className="text-[2.75rem] font-extrabold leading-none" style={{ color: "var(--brand)" }}>
                  {config.discountedPrice}
                </span>
                <svg className="absolute -bottom-2 left-[-4%] w-[108%]" viewBox="0 0 130 14" fill="none" aria-hidden="true">
                  {/* Main sweep — gentle arc that rises in the middle */}
                  <path d="M2,10 C30,4 65,3 98,7 C109,8.5 120,10 128,8.5"
                    stroke="var(--accent-warm)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Soft echo below — creates a calligraphic taper illusion */}
                  <path d="M6,12 C35,8 70,7.5 102,10 C112,11 121,11.5 127,10.5"
                    stroke="var(--accent-warm)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
                </svg>
              </div>
              <span className="inline-flex items-center text-xs font-bold rounded-full px-3 py-1.5 border" style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)", color: "var(--accent-warm)", borderColor: "color-mix(in srgb, var(--accent-warm) 20%, transparent)" }}>
                Spara {config.savings}
              </span>
            </div>

            {/* CTA */}
            <div className="relative self-center md:self-start">
              <CtaButton size="lg" />
              <p className="text-xs mt-3 text-center md:text-left" style={{ color: "var(--muted-foreground, #6B6460)" }}>
                {config.ctaSubtext}
              </p>
              {config.showAtbDisclaimer && (
                <p className="text-[11px] leading-relaxed mt-2 text-center md:text-left max-w-sm" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.7 }}>
                  * {ATB_DISCLAIMER}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="order-1 md:order-2">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[3/4] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              {config.heroImageUrl ? (
                <Image src={config.heroImageUrl} alt={`${config.clinicName}`} fill className="object-cover object-top" priority />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: "var(--secondary)" }} />
              )}
              {/* Floating price badge */}
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>Erbjudandepris</p>
                <p className="text-xl font-extrabold leading-none" style={{ color: "var(--brand)" }}>{config.discountedPrice}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
