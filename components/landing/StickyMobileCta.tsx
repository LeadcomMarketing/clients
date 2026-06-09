"use client"

import CtaButton from "./CtaButton"
import { useTenantConfig } from "@/context/TenantConfigContext"

export default function StickyMobileCta() {
  const config = useTenantConfig()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      role="complementary"
      aria-label="Snabbbokning"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="bg-white/97 backdrop-blur-md border-t px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border, #E5E0D9)" }}
      >
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight truncate" style={{ color: "var(--foreground, #1A1714)" }}>
            Nytt pris:{" "}
            <span className="text-base" style={{ color: "var(--accent-warm)" }}>{config.discountedPrice}</span>
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground, #6B6460)" }}>
            {config.ctaSubtext}
          </p>
        </div>
        <CtaButton
          label={config.ctaLabels?.sticky || "Boka nu →"}
          className="flex-shrink-0 !text-sm !px-5 !py-3"
        />
      </div>
    </div>
  )
}
