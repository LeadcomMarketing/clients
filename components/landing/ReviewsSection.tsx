import type { TenantConfig } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--brand-light, #EEF2F7)" }}>
      <span className="text-xs font-bold" style={{ color: "var(--brand)" }}>{initials}</span>
    </div>
  )
}

function FallbackCards({ config }: { config: TenantConfig }) {
  return (
    <div className="relative bg-white rounded-[2rem] border shadow-[0_8px_48px_rgba(0,0,0,0.10)] overflow-hidden mb-12" style={{ borderColor: "var(--border, #E5E0D9)" }}>
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />

      {/* overflow-x-auto with -webkit-overflow-scrolling for momentum scroll on iOS */}
      <div className="flex gap-4 p-4 md:p-8 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        {config.reviews.map((review, i) => (
          <div key={i} className="flex-shrink-0 w-[78vw] sm:w-72 md:w-80 flex flex-col gap-4 rounded-[1.5rem] p-4 sm:p-5 border" style={{ backgroundColor: "var(--background)", borderColor: "var(--border, #E5E0D9)" }}>
            <div className="flex gap-0.5" aria-label={`${review.rating} av 5 stjärnor`}>
              {Array.from({ length: 5 }).map((_, j) => (
                <svg key={j} width="15" height="15" viewBox="0 0 15 15" fill={j < review.rating ? "#FBBF24" : "var(--border, #E5E0D9)"} aria-hidden="true">
                  <path d="M7.5 1l1.545 3.09L13 4.635l-2.5 2.418.59 3.412L7.5 8.835l-3.09 1.63.59-3.412L2 4.635l3.455-.545L7.5 1z" />
                </svg>
              ))}
            </div>
            <p className="text-base leading-relaxed flex-1" style={{ color: "var(--foreground, #1A1714)" }}>&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "var(--border, #E5E0D9)" }}>
              <Avatar name={review.name} />
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold truncate" style={{ color: "var(--foreground, #1A1714)" }}>{review.name}</p>
                <p className="text-sm" style={{ color: "var(--muted-foreground, #6B6460)" }}>{review.location} · {review.date}</p>
              </div>
              <GoogleLogo />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReviewsSection({ config }: { config: TenantConfig }) {
  const useElfsight = config.reviewsSource === "elfsight" && config.integrations.elfsightWidgetId

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-sm mb-5" style={{ borderColor: "var(--border, #E5E0D9)" }}>
            <GoogleLogo />
            <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground, #6B6460)" }}>Verifierade Google-recensioner</span>
          </div>
          <h2 className="text-[2rem] sm:text-4xl md:text-[2.75rem] font-extrabold text-balance tracking-tight leading-[1.1]" style={{ color: "var(--foreground, #1A1714)" }}>
            {config.reviewsTitle}
          </h2>
          <div className="flex flex-col items-center gap-1.5 mt-3">
            <span className="flex text-yellow-400 text-xl leading-none" aria-hidden="true">★★★★★</span>
            <span className="text-base font-medium" style={{ color: "var(--muted-foreground, #6B6460)" }}>{config.reviewsSubtitle}</span>
          </div>
        </div>

        {/*
          Elfsight live widget — active when elfsightWidgetId is set.
          Fallback card carousel renders otherwise.
          Script is loaded in the tenant layout.
        */}
        {useElfsight ? (
          <div className="mb-12 w-full overflow-x-hidden">
            <div className={`elfsight-app-${config.integrations.elfsightWidgetId}`} data-elfsight-app-lazy />
          </div>
        ) : (
          <FallbackCards config={config} />
        )}

        <div className="flex justify-center">
          <CtaButton size="lg" label={config.ctaLabels?.afterReviews || config.ctaText} />
        </div>
      </div>
    </section>
  )
}
