"use client"

import { useBookingModal } from "@/context/BookingModalContext"
import { useTenantConfig } from "@/context/TenantConfigContext"
import { cn } from "@/lib/utils"

interface CtaButtonProps {
  size?: "default" | "lg"
  className?: string
  label?: string
}

export default function CtaButton({ size = "default", className, label }: CtaButtonProps) {
  const { open } = useBookingModal()
  const config = useTenantConfig()

  return (
    <button
      onClick={open}
      className={cn(
        "inline-flex items-center justify-center font-extrabold rounded-full transition-all duration-200 cursor-pointer",
        "text-white hover:-translate-y-0.5 active:scale-[0.98]",
        size === "lg"
          ? "px-8 py-4 text-base md:text-lg w-full sm:w-auto"
          : "px-6 py-3 text-sm md:text-base",
        className
      )}
      style={{
        backgroundColor: "var(--accent-warm)",
        boxShadow: "0 8px 32px color-mix(in srgb, var(--accent-warm) 35%, transparent)",
      }}
    >
      {label ?? config.ctaText}
    </button>
  )
}
