import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"

export default function PageFooter({ config }: { config: TenantConfig }) {
  return (
    <footer className="text-white py-10 md:py-12 pb-24 md:pb-12" style={{ backgroundColor: "var(--brand)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div>
          {config.branding.logoUrl ? (
            <Image
              src={config.branding.logoUrl}
              alt={config.clinicName}
              height={36}
              width={140}
              className="h-8 w-auto object-contain mb-2 brightness-0 invert"
            />
          ) : (
            <p className="font-extrabold text-lg mb-1">{config.clinicName}</p>
          )}
          <p className="text-sm text-white/50">{config.clinicAddress}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {config.clinicName}. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-white/25 mt-1">
            Ordinariepris {config.originalPrice} · Erbjudandepris {config.discountedPrice} · Gäller tills vidare
          </p>
        </div>
      </div>
    </footer>
  )
}
