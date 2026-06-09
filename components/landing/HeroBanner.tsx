import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"

import type { GoogleRating } from "@/lib/google-places"
import CtaButton from "./CtaButton"

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google" role="img">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} av 5 stjärnor`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i + 1 <= Math.floor(rating)
        const half = !full && i < rating
        return (
          <svg key={i} width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              {half && (
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="#FBBF24"/>
                  <stop offset="50%" stopColor="#E5E0D9"/>
                </linearGradient>
              )}
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={full ? "#FBBF24" : half ? `url(#half-${i})` : "#E5E0D9"}
            />
          </svg>
        )
      })}
    </div>
  )
}

function NativeGoogleBadge({ rating, totalRatings }: GoogleRating) {
  return (
    <div
      className="inline-flex items-center gap-3 bg-white border rounded-2xl px-4 py-2.5 shadow-sm mb-7 self-center md:self-start"
      style={{ borderColor: "var(--border, #E5E0D9)" }}
    >
      <GoogleLogo />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold leading-none" style={{ color: "var(--foreground, #1A1714)" }}>
            {rating.toFixed(1)}
          </span>
          <StarRow rating={rating} />
        </div>
        <span className="text-xs" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          {totalRatings.toLocaleString("sv-SE")} recensioner på Google
        </span>
      </div>
    </div>
  )
}

export default function HeroBanner({
  config,
  googleRating,
}: {
  config: TenantConfig
  googleRating?: GoogleRating | null
}) {
  return (
    <section className="pt-6 pb-16 md:pt-10 md:pb-24" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">

            {/* Trust badge — priority: native Google → Elfsight widget → text pill → hidden */}
            {googleRating ? (
              <div className="self-center md:self-start mb-5">
                <NativeGoogleBadge {...googleRating} />
              </div>
            ) : config.trustBadgeElfsightId ? (
              /* Elfsight badge */
              <div className="mb-5 self-center md:self-start overflow-hidden">
                <div className={`elfsight-app-${config.trustBadgeElfsightId}`} data-elfsight-app-lazy />
              </div>
            ) : config.trustBadge ? (
              <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2.5 shadow-sm mb-5 self-center md:self-start" style={{ borderColor: "var(--border, #E5E0D9)" }}>
                <span className="flex text-yellow-400 text-base leading-none" aria-hidden="true">★★★★★</span>
                <span className="text-sm font-semibold" style={{ color: "var(--brand)" }}>{config.trustBadge}</span>
              </div>
            ) : null}

            {/* Headline */}
            <h1 className="text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance mb-5" style={{ color: "var(--foreground, #1A1714)" }}>
              {config.heroHeadline}
            </h1>

            <p className="text-xl sm:text-2xl md:text-2xl leading-relaxed mb-7 text-pretty max-w-md" style={{ color: "var(--muted-foreground, #6B6460)" }}>
              {config.heroSubheadline}
            </p>

            {/* Price lockup */}
            <div className="relative flex items-center justify-center md:justify-start flex-wrap gap-3 mb-8 w-full md:w-auto">
              <span className="text-base sm:text-lg line-through font-medium whitespace-nowrap" style={{ color: "var(--muted-foreground, #6B6460)" }}>
                {config.originalPrice}
              </span>
              <div className="relative inline-block overflow-visible">
                <span className="text-[2.75rem] sm:text-[3.25rem] font-extrabold leading-none" style={{ color: "var(--brand)" }}>
                  {config.discountedPrice}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 130 14" fill="none" aria-hidden="true">
                  {/* Main sweep — gentle arc that rises in the middle */}
                  <path d="M2,10 C30,4 65,3 98,7 C109,8.5 120,10 128,8.5"
                    stroke="var(--accent-warm)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Soft echo below — creates a calligraphic taper illusion */}
                  <path d="M6,12 C35,8 70,7.5 102,10 C112,11 121,11.5 127,10.5"
                    stroke="var(--accent-warm)" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
                </svg>
              </div>
              <span className="inline-flex items-center text-sm font-bold rounded-full px-3 py-1.5 border" style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)", color: "var(--accent-warm)", borderColor: "color-mix(in srgb, var(--accent-warm) 20%, transparent)" }}>
                Spara {config.savings}
              </span>
            </div>

            {/* CTA */}
            <div className="relative w-full md:w-auto text-center md:text-left">
              <CtaButton size="lg" label={config.ctaLabels?.hero || config.ctaText} />
              <p className="text-lg mt-3 text-center md:text-left" style={{ color: "var(--muted-foreground, #6B6460)" }}>
                {config.ctaSubtext}
              </p>
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
