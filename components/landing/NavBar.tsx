import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

export default function NavBar({ config }: { config: TenantConfig }) {
  return (
    <nav className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex items-center justify-between">
      {config.branding.logoUrl ? (
        <Image
          src={config.branding.logoUrl}
          alt={config.clinicName}
          height={40}
          width={160}
          className="h-9 md:h-10 w-auto object-contain"
          priority
        />
      ) : (
        <span className="font-extrabold text-base md:text-lg tracking-tight" style={{ color: "var(--brand)" }}>
          {config.clinicName}
        </span>
      )}
      <CtaButton size="default" label={config.ctaLabels?.nav || "Boka tid →"} />
    </nav>
  )
}
