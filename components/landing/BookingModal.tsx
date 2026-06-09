"use client"

import { useEffect, useRef, useState } from "react"
import { useBookingModal } from "@/context/BookingModalContext"
import { useTenantConfig } from "@/context/TenantConfigContext"
import { ATB_DISCLAIMER } from "@/lib/tenant-types"

type Step = "form" | "submitting" | "thankyou" | "embed"
interface FormData { name: string; email: string; phone: string }

// ── Opt-in form ────────────────────────────────────────────────────

function LeadForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (d: FormData) => void
  submitting: boolean
}) {
  const config = useTenantConfig()
  const { headline, subheadline, ctaText } = config.integrations.leadForm
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => nameRef.current?.focus(), 100) }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name:  fd.get("name")  as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
    })
  }

  return (
    <div className="flex-1 overflow-auto overscroll-contain">
      <div className="px-5 sm:px-7 pt-4 pb-2">
        {/* Social proof strip */}
        <div className="flex justify-center mb-4">
          <span className="flex text-yellow-400 text-base leading-none" aria-hidden="true">★★★★★</span>
        </div>

        {/* Headline */}
        <h2 className="text-lg sm:text-xl font-extrabold text-center mb-1 leading-snug text-balance"
          style={{ color: "var(--foreground, #1A1714)" }}>
          {headline}
        </h2>
        <p className="text-xs sm:text-sm text-center mb-5 text-pretty"
          style={{ color: "var(--muted-foreground, #6B6460)" }}>
          {subheadline}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-5 sm:px-7 flex flex-col gap-3">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="lf-name" className="text-xs font-semibold"
              style={{ color: "var(--muted-foreground, #6B6460)" }}>
              Förnamn och efternamn <span className="text-red-400">*</span>
            </label>
            <input
              ref={nameRef}
              id="lf-name" name="name" type="text"
              autoComplete="name" required minLength={2}
              placeholder="Anna Svensson"
              /* text-[16px] is critical — prevents iOS auto-zoom on focus */
              className="w-full rounded-xl px-4 py-3.5 text-[16px] border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border, #E5E0D9)",
                color: "var(--foreground, #1A1714)",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--brand)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border, #E5E0D9)"}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="lf-email" className="text-xs font-semibold"
              style={{ color: "var(--muted-foreground, #6B6460)" }}>
              E-postadress <span className="text-red-400">*</span>
            </label>
            <input
              id="lf-email" name="email" type="email"
              autoComplete="email" required
              placeholder="anna@exempel.se"
              className="w-full rounded-xl px-4 py-3.5 text-[16px] border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border, #E5E0D9)",
                color: "var(--foreground, #1A1714)",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--brand)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border, #E5E0D9)"}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="lf-phone" className="text-xs font-semibold"
              style={{ color: "var(--muted-foreground, #6B6460)" }}>
              Mobilnummer <span className="text-red-400">*</span>
            </label>
            <input
              id="lf-phone" name="phone" type="tel"
              autoComplete="tel" required
              inputMode="tel"
              placeholder="070 123 45 67"
              className="w-full rounded-xl px-4 py-3.5 text-[16px] border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border, #E5E0D9)",
                color: "var(--foreground, #1A1714)",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--brand)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border, #E5E0D9)"}
            />
            <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.8 }}>
              Vi ringer dig för att bekräfta din tid — se till att du kan svara.
            </p>
          </div>
        </div>

        {/* Sticky submit area */}
        <div
          className="sticky bottom-0 px-5 sm:px-7 pt-4 pb-4 mt-3"
          style={{
            backgroundColor: "white",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
          }}
        >
          <button
            type="submit"
            disabled={submitting}
            className="w-full font-extrabold rounded-full py-4 text-base text-white transition-all disabled:opacity-60 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--accent-warm)",
              boxShadow: "0 8px 28px color-mix(in srgb, var(--accent-warm) 40%, transparent)",
            }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Skickar…
              </span>
            ) : ctaText}
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.5 }} aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.55 }}>
              Dina uppgifter är trygga. Vi delar aldrig din information.
            </p>
          </div>
          {config.showAtbDisclaimer && (
            <p className="text-[11px] leading-relaxed mt-2 text-center" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.6 }}>
              * {ATB_DISCLAIMER}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

// ── Thank-you screen ───────────────────────────────────────────────

function ThankYouScreen({ name, phone }: { name: string; phone: string }) {
  const config = useTenantConfig()
  const firstName = name.trim().split(" ")[0]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-4"
      style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: "var(--accent-warm-light, #FBF1EC)" }} aria-hidden="true">
        🎉
      </div>
      <div>
        <h2 className="text-xl font-extrabold mb-2 leading-tight"
          style={{ color: "var(--foreground, #1A1714)" }}>
          Tack, {firstName}!<br />Vi hör av oss snart.
        </h2>
        <p className="text-sm leading-relaxed text-pretty max-w-xs"
          style={{ color: "var(--muted-foreground, #6B6460)" }}>
          En koordinator från {config.clinicName} ringer dig på{" "}
          <span className="font-bold" style={{ color: "var(--foreground, #1A1714)" }}>{phone}</span>.
        </p>
      </div>
      <div className="w-full max-w-xs rounded-2xl px-4 py-4 border flex gap-3 items-start text-left"
        style={{
          backgroundColor: "var(--accent-warm-light, #FBF1EC)",
          borderColor: "color-mix(in srgb, var(--accent-warm) 20%, transparent)",
        }}>
        <span className="text-lg flex-shrink-0" aria-hidden="true">⚠️</span>
        <div>
          <p className="text-xs font-bold mb-0.5" style={{ color: "var(--accent-warm)" }}>
            Viktigt — svara i telefonen!
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground, #1A1714)" }}>
            Din plats är <strong>inte säkrad</strong> förrän en tid har bokats in.
          </p>
        </div>
      </div>
      <p className="text-[11px]" style={{ color: "var(--muted-foreground, #6B6460)", opacity: 0.7 }}>
        Vi ser fram emot att välkomna dig till {config.clinicName}!
      </p>
    </div>
  )
}

// ── Calendar embed ─────────────────────────────────────────────────

function EmbedScreen({ embedUrl }: { embedUrl: string }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 py-3 border-b flex-shrink-0"
        style={{ borderColor: "var(--border, #E5E0D9)", backgroundColor: "var(--secondary)" }}>
        <p className="text-sm font-bold" style={{ color: "var(--foreground, #1A1714)" }}>
          Välj en tid nedan för att säkra din plats
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>
          Din bokning är inte bekräftad förrän du valt en tid.
        </p>
      </div>
      <iframe
        src={embedUrl} width="100%"
        style={{ minHeight: "520px", flex: 1 }}
        frameBorder="0" title="Boka tid" loading="lazy"
      />
    </div>
  )
}

// ── Main modal ─────────────────────────────────────────────────────

export default function BookingModal() {
  const { isOpen, close } = useBookingModal()
  const config = useTenantConfig()
  const [step, setStep] = useState<Step>("form")
  const [submitting, setSubmitting] = useState(false)
  const [leadData, setLeadData] = useState<FormData>({ name: "", email: "", phone: "" })

  const { redirectType, redirectUrl, embedUrl } = config.integrations.leadForm

  useEffect(() => {
    if (isOpen) { setStep("form") }
  }, [isOpen])

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
    try {
      await fetch(`/api/tenants/${config.slug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch { /* non-fatal */ }

    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "Lead")
    }

    if (redirectType === "url" && redirectUrl) {
      // Small delay so the pixel beacon has time to dispatch before navigation
      await new Promise(resolve => setTimeout(resolve, 300))
      window.location.href = redirectUrl
      return
    }

    setStep(redirectType === "embed" ? "embed" : "thankyou")
    setSubmitting(false)
  }

  if (!isOpen) return null

  const stepTitle = step === "form"
    ? config.clinicName
    : step === "embed" ? "Välj din tid" : "Anmälan mottagen"

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4"
      role="dialog" aria-modal="true" aria-label="Boka tid"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      {/* Panel — bottom sheet on mobile, centred card on sm+ */}
      <div
        className="relative bg-white w-full sm:max-w-md
          rounded-t-[1.5rem] sm:rounded-[2rem]
          shadow-[0_-8px_48px_rgba(0,0,0,0.25)] sm:shadow-[0_32px_96px_rgba(0,0,0,0.35)]
          flex flex-col overflow-hidden"
        style={{ maxHeight: "92dvh" }}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-0 flex-shrink-0" aria-hidden="true">
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "var(--border, #E5E0D9)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-5 border-b flex-shrink-0"
          style={{ borderColor: "var(--border, #E5E0D9)" }}>
          <div className="flex-1 pr-3 min-w-0">
            <p className="font-extrabold text-sm sm:text-base leading-tight truncate"
              style={{ color: "var(--foreground, #1A1714)" }}>
              {stepTitle}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground, #6B6460)" }}>
              {config.clinicName} · {config.discountedPrice}
            </p>
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--secondary)" }}
            aria-label="Stäng"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        {step === "form" && <LeadForm onSubmit={handleFormSubmit} submitting={submitting} />}
        {step === "thankyou" && <ThankYouScreen name={leadData.name} phone={leadData.phone} />}
        {step === "embed" && embedUrl && <EmbedScreen embedUrl={embedUrl} />}
        {step === "embed" && !embedUrl && (
          <div className="flex-1 flex items-center justify-center p-8 text-center"
            style={{ color: "var(--muted-foreground, #6B6460)" }}>
            <p className="text-sm">Ingen kalender-länk konfigurerad.</p>
          </div>
        )}
      </div>
    </div>
  )
}
