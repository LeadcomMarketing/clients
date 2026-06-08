"use client"

import { useEffect, useRef, useState } from "react"
import { useBookingModal } from "@/context/BookingModalContext"
import { useTenantConfig } from "@/context/TenantConfigContext"

// ── Types ─────────────────────────────────────────────────────────

type Step = "form" | "submitting" | "thankyou" | "embed"

interface FormData {
  name: string
  email: string
  phone: string
}

// ── Sub-components ────────────────────────────────────────────────

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between px-7 py-5 border-b flex-shrink-0" style={{ borderColor: "var(--border, #E5E0D9)" }}>
      <div className="flex-1 pr-4">
        <p className="font-extrabold text-base leading-tight" style={{ color: "var(--foreground, #1A1714)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>{subtitle}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: "var(--secondary)" }}
        aria-label="Stäng"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Step 1: Opt-in form ───────────────────────────────────────────

function LeadForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (data: FormData) => void
  submitting: boolean
}) {
  const config = useTenantConfig()
  const { headline, subheadline, ctaText } = config.integrations.leadForm
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 80)
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
    })
  }

  return (
    <div className="flex-1 overflow-auto px-7 py-6">
      {/* Social proof strip */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="flex text-yellow-400 text-sm leading-none" aria-hidden="true">★★★★★</span>
        <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          {config.trustBadge}
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-xl font-extrabold text-center mb-1.5 text-balance leading-snug" style={{ color: "var(--foreground, #1A1714)" }}>
        {headline}
      </h2>
      <p className="text-sm text-center mb-6 text-pretty" style={{ color: "var(--muted-foreground, #6B6460)" }}>
        {subheadline}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-name" className="text-xs font-semibold" style={{ color: "var(--muted-foreground, #6B6460)" }}>
            Förnamn och efternamn <span className="text-red-400">*</span>
          </label>
          <input
            ref={nameRef}
            id="lf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Anna Svensson"
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-shadow"
            style={{
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border, #E5E0D9)",
              color: "var(--foreground, #1A1714)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border, #E5E0D9)")}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-email" className="text-xs font-semibold" style={{ color: "var(--muted-foreground, #6B6460)" }}>
            E-postadress <span className="text-red-400">*</span>
          </label>
          <input
            id="lf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="anna@exempel.se"
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-shadow"
            style={{
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border, #E5E0D9)",
              color: "var(--foreground, #1A1714)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border, #E5E0D9)")}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label htmlFor="lf-phone" className="text-xs font-semibold" style={{ color: "var(--muted-foreground, #6B6460)" }}>
            Mobilnummer <span className="text-red-400">*</span>
          </label>
          <input
            id="lf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="070 123 45 67"
            className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-shadow"
            style={{
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border, #E5E0D9)",
              color: "var(--foreground, #1A1714)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border, #E5E0D9)")}
          />
          <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.8 }}>
            Vi ringer dig för att bekräfta din tid — se till att du kan svara.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 font-extrabold rounded-full py-4 text-base text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-[0.98]"
          style={{
            backgroundColor: "var(--accent-warm)",
            boxShadow: "0 8px 28px color-mix(in srgb, var(--accent-warm) 40%, transparent)",
          }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Skickar…
            </span>
          ) : ctaText}
        </button>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.6 }} aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.6 }}>
            Dina uppgifter är trygga. Vi delar aldrig din information med tredje part.
          </p>
        </div>
      </form>
    </div>
  )
}

// ── Step 2a: Built-in thank-you screen ────────────────────────────

function ThankYouScreen({ name, phone }: { name: string; phone: string }) {
  const config = useTenantConfig()
  const firstName = name.trim().split(" ")[0]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center gap-5">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
        style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)" }}
        aria-hidden="true"
      >
        🎉
      </div>

      <div>
        <h2 className="text-xl font-extrabold mb-2 leading-tight" style={{ color: "var(--foreground, #1A1714)" }}>
          Tack, {firstName}!<br />Vi hör av oss snart.
        </h2>
        <p className="text-sm leading-relaxed text-pretty max-w-xs" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          En koordinator från {config.clinicName} kommer att ringa dig på{" "}
          <span className="font-bold" style={{ color: "var(--foreground, #1A1714)" }}>{phone}</span> för att bekräfta din tid.
        </p>
      </div>

      {/* Urgency callout */}
      <div
        className="w-full max-w-xs rounded-2xl px-5 py-4 border flex gap-3 items-start text-left"
        style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)", borderColor: "color-mix(in srgb, var(--accent-warm) 20%, transparent)" }}
      >
        <span className="text-lg flex-shrink-0" aria-hidden="true">⚠️</span>
        <div>
          <p className="text-xs font-bold mb-0.5" style={{ color: "var(--accent-warm)" }}>
            Viktigt — svara i telefonen!
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground, #1A1714)" }}>
            Din plats är <strong>inte säkrad</strong> förrän en tid har bokats in. Vänligen se till att du kan ta emot samtal.
          </p>
        </div>
      </div>

      <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.7 }}>
        Vi ser fram emot att välkomna dig till {config.clinicName}!
      </p>
    </div>
  )
}

// ── Step 2c: Calendar embed screen ───────────────────────────────

function EmbedScreen({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-7 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border, #E5E0D9)", backgroundColor: "var(--secondary)" }}>
        <p className="text-sm font-bold" style={{ color: "var(--foreground, #1A1714)" }}>
          Välj en tid nedan för att säkra din plats
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          Din bokning är inte bekräftad förrän du valt en tid i kalendern.
        </p>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        style={{ minHeight: "520px", flex: 1 }}
        frameBorder="0"
        title="Boka tid"
        loading="lazy"
      />
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────

export default function BookingModal() {
  const { isOpen, close } = useBookingModal()
  const config = useTenantConfig()
  const [step, setStep] = useState<Step>("form")
  const [submitting, setSubmitting] = useState(false)
  const [leadData, setLeadData] = useState<FormData>({ name: "", email: "", phone: "" })
  const [error, setError] = useState("")

  const { redirectType, redirectUrl, embedUrl } = config.integrations.leadForm

  // Reset to form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("form")
      setError("")
    }
  }, [isOpen])

  // Keyboard + scroll lock
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, close])

  async function handleFormSubmit(data: FormData) {
    setSubmitting(true)
    setLeadData(data)
    setError("")

    try {
      await fetch(`/api/tenants/${config.slug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch {
      // Non-fatal — we still proceed with the redirect even if saving fails
    }

    // Fire Facebook Pixel Lead event if pixel is active
    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "Lead")
    }

    if (redirectType === "url" && redirectUrl) {
      window.location.href = redirectUrl
      return // page is navigating away
    }

    if (redirectType === "embed") {
      setStep("embed")
    } else {
      setStep("thankyou")
    }

    setSubmitting(false)
  }

  if (!isOpen) return null

  // ── Modal header props per step ──────────────────────────────
  const headerProps = (() => {
    if (step === "form") return {
      title: config.integrations.leadForm.headline,
      subtitle: `${config.clinicName} · ${config.discountedPrice}`,
    }
    if (step === "embed") return {
      title: "Välj din tid",
      subtitle: "Boka direkt i kalendern nedan",
    }
    return {
      title: "Anmälan mottagen",
      subtitle: config.clinicName,
    }
  })()

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Boka tid"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      {/* Panel — full-screen on mobile, max-width card on sm+ */}
      <div
        className="relative bg-white w-full sm:rounded-[2rem] overflow-hidden sm:max-w-md shadow-[0_32px_96px_rgba(0,0,0,0.35)] flex flex-col"
        style={{ maxHeight: "95dvh" }}
      >
        <ModalHeader {...headerProps} onClose={close} />

        {error && (
          <p className="text-sm text-red-500 px-7 pt-3 text-center">{error}</p>
        )}

        {step === "form" && (
          <LeadForm onSubmit={handleFormSubmit} submitting={submitting} />
        )}

        {step === "thankyou" && (
          <ThankYouScreen name={leadData.name} phone={leadData.phone} />
        )}

        {step === "embed" && embedUrl && (
          <EmbedScreen embedUrl={embedUrl} />
        )}

        {step === "embed" && !embedUrl && (
          <div className="flex-1 flex items-center justify-center p-8 text-center" style={{ color: "var(--muted-foreground, #6B6460)" }}>
            <p className="text-sm">Ingen kalender-länk konfigurerad. Lägg till en Embed-URL under Integrationer i admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
