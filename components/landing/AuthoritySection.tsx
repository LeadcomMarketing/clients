import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"

export default function AuthoritySection({ config }: { config: TenantConfig }) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.25)]" style={{ backgroundColor: "var(--brand)" }}>
          <div className="flex flex-col md:flex-row">

            {/* Photo — aspect-[3/2] on mobile gives a tight head/shoulder crop */}
            <div className="md:w-2/5 relative aspect-[3/2] md:aspect-auto md:min-h-0">
              {config.dentistImageUrl ? (
                <Image src={config.dentistImageUrl} alt={`${config.dentistName}, ${config.dentistTitle}`} fill className="object-cover object-top" />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand) 70%, black)" }} />
              )}
            </div>

            {/* Content */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="text-[4rem] font-serif leading-none mb-3 select-none" style={{ color: "var(--accent-warm)" }} aria-hidden="true">&ldquo;</div>
              <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-6 text-pretty">
                {config.dentistQuote}
              </blockquote>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5" style={{ backgroundColor: "var(--accent-warm)" }} />
                <div>
                  <p className="font-bold text-white text-xl">{config.dentistName}</p>
                  <p className="text-lg text-white/60">{config.dentistTitle}</p>
                </div>
              </div>
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed">{config.dentistBio}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
