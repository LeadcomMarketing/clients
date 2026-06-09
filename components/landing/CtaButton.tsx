"use client"

import { useBookingModal } from "@/context/BookingModalContext"
import { useTenantConfig } from "@/context/TenantConfigContext"
import { ATB_DISCLAIMER } from "@/lib/tenant-types"
import { cn } from "@/lib/utils"

interface CtaButtonProps {
  size?: "default" | "lg"
  className?: string
  label?: string
  /** Pass true to suppress the ATB disclaimer even when the tenant has it enabled (e.g. nav button) */
  hideDisclaimer?: boolean
}

export default function CtaButton({ size = "default", className, label, hideDisclaimer }: CtaButtonProps) {
  const { open } = useBookingModal()
  const config = useTenantConfig()
  const showAtb = !hideDisclaimer && config.showAtbDisclaimer

  return (
    <div className={cn("flex flex-col items-center gap-2", size === "lg" ? "w-full sm:w-auto" : "")}>
      <button
        onClick={open}
        className={cn(
          "inline-flex items-center justify-center font-extrabold rounded-full transition-all duration-200 cursor-pointer",
          "text-white hover:-translate-y-0.5 active:scale-[0.98]",
          size === "lg"
            ? "px-8 py-5 text-base md:text-lg w-full"
            : "px-6 py-4 text-sm md:text-base",
          className
        )}
        style={{
          backgroundColor: "var(--accent-warm)",
          boxShadow: "0 8px 32px color-mix(in srgb, var(--accent-warm) 35%, transparent)",
        }}
      >
        {label ?? config.ctaText}
      </button>
      {showAtb && (
        <p className="text-[11px] leading-relaxed text-center max-w-xs" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.65 }}>
          * {ATB_DISCLAIMER}
        </p>
      )}
    </div>
  )
}
