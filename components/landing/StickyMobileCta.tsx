"use client"

import CtaButton from "./CtaButton"
import { useTenantConfig } from "@/context/TenantConfigContext"
import { ATB_DISCLAIMER } from "@/lib/tenant-types"

export default function StickyMobileCta() {
  const config = useTenantConfig()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" role="complementary" aria-label="Snabbbokning">
      {config.showAtbDisclaimer && (
        <div className="px-4 py-1.5 text-center" style={{ backgroundColor: "var(--secondary)" }}>
          <p className="text-[10px] leading-snug" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.8 }}>
            * {ATB_DISCLAIMER}
          </p>
        </div>
      )}
      <div className="bg-white/95 backdrop-blur-md border-t px-5 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between gap-4" style={{ borderColor: "var(--border, #E5E0D9)" }}>
        <div>
          <p className="text-xs font-bold leading-tight" style={{ color: "var(--foreground, #1A1714)" }}>
            Nytt patient-pris:{" "}
            <span className="text-sm" style={{ color: "var(--accent-warm)" }}>{config.discountedPrice}</span>
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>{config.ctaSubtext}</p>
        </div>
        <CtaButton label="Boka nu →" className="flex-shrink-0 !text-sm !px-5 !py-3" />
      </div>
    </div>
  )
}
