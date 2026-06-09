import Image from "next/image"
import type { TenantConfig } from "@/lib/tenant-types"
import CtaButton from "./CtaButton"

export default function NavBar({ config }: { config: TenantConfig }) {
  return (
    <nav className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3 w-full">
      {config.branding.logoUrl ? (
        <Image
          src={config.branding.logoUrl}
          alt={config.clinicName}
          height={40}
          width={160}
          className="h-10 md:h-12 w-auto object-contain"
          priority
        />
      ) : (
        <span className="font-extrabold text-base md:text-lg tracking-tight truncate min-w-0 flex-1" style={{ color: "var(--brand)" }}>
          {config.clinicName}
        </span>
      )}
      <CtaButton size="default" label={config.ctaLabels?.nav || "Boka tid →"} className="!px-4 !py-2.5 !text-sm whitespace-nowrap" />
    </nav>
  )
}
