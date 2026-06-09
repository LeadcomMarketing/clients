import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"

export default function ClinicSection({ config }: { config: TenantConfig }) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <h2 className="text-[2rem] sm:text-4xl md:text-[2.75rem] font-extrabold text-center text-balance mb-3 tracking-tight leading-[1.1]" style={{ color: "var(--foreground, #1A1714)" }}>
          {config.clinicTitle}
        </h2>
        <p className="text-center text-xl md:text-base leading-relaxed max-w-xl mx-auto mb-10" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          {config.clinicBody}
        </p>

        <div className="rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.15)] aspect-video relative">
          {config.interiorImageUrl ? (
            <Image src={config.interiorImageUrl} alt={`Interiör av ${config.clinicName}`} fill className="object-cover" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: "var(--brand-light, #EEF2F7)" }} />
          )}
          <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground, #6B6460)" }}>Moderna lokaler</p>
            <p className="text-base font-extrabold" style={{ color: "var(--brand)" }}>{config.clinicCity}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
