"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { TenantConfig, IncludedItem, Review } from "@/lib/tenant-types"
import { DEFAULT_BRANDING } from "@/lib/tenant-types"
import { GOOGLE_FONTS } from "@/lib/google-fonts"

// ── Shared field primitives ────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-600">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text", readOnly }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; readOnly?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 read-only:opacity-60"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
    />
  )
}

function ColorField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5 bg-slate-800"
          />
        </div>
        <Input value={value} onChange={onChange} placeholder="#000000" />
      </div>
    </Field>
  )
}

// ── Image upload field ─────────────────────────────────────────────

function ImageField({ label, value, onChange, slug }: {
  label: string; value: string; onChange: (v: string) => void; slug: string
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch(`/api/tenants/${slug}/upload`, { method: "POST", body: fd })
    const data = await res.json()
    if (data.url) onChange(data.url)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full max-h-40 object-cover rounded-xl" />
        )}
        <div className="flex items-center gap-2">
          <Input value={value} onChange={onChange} placeholder="/images/..." />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl px-3 py-2.5 transition-colors whitespace-nowrap"
          >
            {uploading ? "Laddar…" : "Ladda upp"}
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </Field>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────

const TABS = [
  { id: "general",    label: "Allmänt" },
  { id: "branding",   label: "Varumärke" },
  { id: "offer",      label: "Erbjudande" },
  { id: "included",   label: "Ingår" },
  { id: "dentist",    label: "Tandläkare" },
  { id: "reviews",    label: "Recensioner" },
  { id: "clinic",     label: "Kliniken" },
  { id: "integrations", label: "Integrationer" },
  { id: "domain",     label: "Domän" },
] as const

type TabId = (typeof TABS)[number]["id"]

// ── Main form component ────────────────────────────────────────────

interface Props {
  initial: TenantConfig
  isNew?: boolean
}

export function TenantEditForm({ initial, isNew = false }: Props) {
  const router = useRouter()
  const [config, setConfig] = useState<TenantConfig>(initial)
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  function update<K extends keyof TenantConfig>(key: K, value: TenantConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function updateBranding<K extends keyof TenantConfig["branding"]>(key: K, value: string) {
    setConfig((prev) => ({ ...prev, branding: { ...prev.branding, [key]: value } }))
    setSaved(false)
  }

  function updateIntegrations<K extends keyof TenantConfig["integrations"]>(key: K, value: string) {
    setConfig((prev) => ({ ...prev, integrations: { ...prev.integrations, [key]: value } }))
    setSaved(false)
  }

  // ── Included items ────────────────────────────────────────────────
  function updateItem(i: number, patch: Partial<IncludedItem>) {
    const items = [...config.includedItems]
    items[i] = { ...items[i], ...patch }
    update("includedItems", items)
  }
  function addItem() {
    update("includedItems", [...config.includedItems, { title: "", description: "", value: "" }])
  }
  function removeItem(i: number) {
    update("includedItems", config.includedItems.filter((_, idx) => idx !== i))
  }
  function moveItem(i: number, dir: -1 | 1) {
    const items = [...config.includedItems]
    const j = i + dir
    if (j < 0 || j >= items.length) return
    ;[items[i], items[j]] = [items[j], items[i]]
    update("includedItems", items)
  }

  // ── Reviews ───────────────────────────────────────────────────────
  function updateReview(i: number, patch: Partial<Review>) {
    const reviews = [...config.reviews]
    reviews[i] = { ...reviews[i], ...patch }
    update("reviews", reviews)
  }
  function addReview() {
    update("reviews", [...config.reviews, { name: "", location: "", rating: 5, text: "", date: "" }])
  }
  function removeReview(i: number) {
    update("reviews", config.reviews.filter((_, idx) => idx !== i))
  }

  // ── Save ──────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const url = isNew ? "/api/tenants" : `/api/tenants/${initial.slug}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? "Något gick fel")
      } else {
        setSaved(true)
        if (isNew) {
          const created = await res.json()
          router.push(`/admin/${created.slug}`)
        }
      }
    } catch {
      setError("Nätverksfel")
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 flex-shrink-0">
        <div>
          <h1 className="text-lg font-extrabold text-white">
            {isNew ? "Ny klinik" : config.clinicName || config.slug}
          </h1>
          {!isNew && <p className="text-xs text-slate-500 mt-0.5 font-mono">/{config.slug}</p>}
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {saved && <p className="text-sm text-green-400">✓ Sparat</p>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors"
          >
            {saving ? "Sparar…" : isNew ? "Skapa klinik" : "Spara ändringar"}
          </button>
          {!isNew && (
            <a
              href={`/${config.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl px-4 py-2.5 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
              Förhandsgranska
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-8 flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-orange-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === "general" && (
          <Section title="Allmän information">
            <Grid>
              <Field label="Kliniknamn" hint="Visas i navigeringen och sidfoten">
                <Input value={config.clinicName} onChange={(v) => update("clinicName", v)} placeholder="Haga Tandläkeri" />
              </Field>
              <Field label="Slug (URL)" hint={isNew ? "Kan inte ändras efter skapande" : "Skrivskyddad"}>
                <Input
                  value={config.slug}
                  onChange={isNew ? (v) => update("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-")) : undefined}
                  readOnly={!isNew}
                  placeholder="haga-tandlakeri"
                />
              </Field>
              <Field label="Stad">
                <Input value={config.clinicCity} onChange={(v) => update("clinicCity", v)} placeholder="Stockholm" />
              </Field>
              <Field label="Adress" hint="Visas i sidfoten">
                <Input value={config.clinicAddress} onChange={(v) => update("clinicAddress", v)} placeholder="Hagaesplanaden 2B, Stockholm" />
              </Field>
              <Field label="Annonseringstext" hint="Den röda bannern längst upp">
                <Input value={config.announcementBadge} onChange={(v) => update("announcementBadge", v)} />
              </Field>
            </Grid>
          </Section>
        )}

        {activeTab === "branding" && (
          <Section title="Varumärke & design">

            {/* ── Logo ──────────────────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Logotyp</h3>
              <ImageField
                label="Logotyp"
                value={config.branding.logoUrl}
                onChange={(v) => updateBranding("logoUrl", v)}
                slug={config.slug}
              />
              <p className="text-[11px] text-slate-600 mt-2">
                Rekommenderat format: PNG med transparent bakgrund, max 400 × 120 px.
                Logotypen visas i navigeringen och sidfoten. Om inget laddas upp används kliniknamnet som text.
                I sidfoten inverteras logotypen automatiskt till vit.
              </p>
            </div>

            {/* ── Colours ───────────────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Färger</h3>
              <Grid>
                <ColorField
                  label="Varumärkesfärg (mörk)"
                  value={config.branding.brandColor}
                  onChange={(v) => updateBranding("brandColor", v)}
                  hint="Navigering, rubriker, mörka bakgrunder"
                />
                <ColorField
                  label="Accentfärg (CTA)"
                  value={config.branding.accentColor}
                  onChange={(v) => updateBranding("accentColor", v)}
                  hint="Knappar, märken, understrykningar"
                />
                <ColorField
                  label="Sidbakgrund"
                  value={config.branding.pageBg}
                  onChange={(v) => updateBranding("pageBg", v)}
                  hint="Varm vit bakgrund"
                />
                <ColorField
                  label="Sektionsbakgrund"
                  value={config.branding.sectionBg}
                  onChange={(v) => updateBranding("sectionBg", v)}
                  hint="Varannan sektions bakgrund"
                />
              </Grid>

              {/* Live colour preview */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-700">
                <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: config.branding.brandColor }}>
                  <span className="font-bold text-white text-sm">{config.clinicName || "Kliniknamn"}</span>
                  <span className="text-white/60 text-xs">Navigering</span>
                </div>
                <div className="px-5 py-6 flex items-center gap-4" style={{ backgroundColor: config.branding.pageBg }}>
                  <p className="font-bold text-sm" style={{ color: config.branding.brandColor }}>Rubrikfärg</p>
                  <button className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: config.branding.accentColor }}>
                    {config.ctaText || "Boka nu →"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, branding: { ...p.branding, ...DEFAULT_BRANDING, logoUrl: p.branding.logoUrl, fontHeadline: p.branding.fontHeadline, fontBody: p.branding.fontBody } }))}
                className="mt-3 text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded-lg px-3 py-2 transition-colors"
              >
                Återställ standardfärger
              </button>
            </div>

            {/* ── Fonts ─────────────────────────────────────────── */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Typsnitt</h3>
              <Grid>
                <Field label="Rubriktypssnitt" hint="Används för h1–h5. Lämna tomt för att ärva brödtexttypsnitt.">
                  <select
                    value={config.branding.fontHeadline}
                    onChange={(e) => updateBranding("fontHeadline", e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">— Standard (Plus Jakarta Sans) —</option>
                    <optgroup label="Sans-serif">
                      {GOOGLE_FONTS.filter(f => f.category === "sans-serif").map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Serif">
                      {GOOGLE_FONTS.filter(f => f.category === "serif").map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </Field>

                <Field label="Brödtexttypsnitt" hint="Används för löptext, knappar och UI. Lämna tomt för Plus Jakarta Sans.">
                  <select
                    value={config.branding.fontBody}
                    onChange={(e) => updateBranding("fontBody", e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">— Standard (Plus Jakarta Sans) —</option>
                    <optgroup label="Sans-serif">
                      {GOOGLE_FONTS.filter(f => f.category === "sans-serif").map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Serif">
                      {GOOGLE_FONTS.filter(f => f.category === "serif").map(f => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </Field>
              </Grid>

              {/* Font preview */}
              {(config.branding.fontHeadline || config.branding.fontBody) && (
                <div className="mt-4 rounded-xl border border-slate-700 overflow-hidden">
                  <link
                    rel="stylesheet"
                    href={`https://fonts.googleapis.com/css2?${[config.branding.fontBody, config.branding.fontHeadline].filter(Boolean).map(f => `family=${encodeURIComponent(f!)}:wght@400;700`).join("&")}&display=swap`}
                  />
                  <div className="px-5 py-4" style={{ backgroundColor: "#0f172a" }}>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Förhandsgranskning</p>
                    <p
                      className="text-xl font-bold text-white mb-1"
                      style={{ fontFamily: config.branding.fontHeadline ? `'${config.branding.fontHeadline}', sans-serif` : undefined }}
                    >
                      Din första undersökning
                    </p>
                    <p
                      className="text-sm text-slate-300"
                      style={{ fontFamily: config.branding.fontBody ? `'${config.branding.fontBody}', sans-serif` : undefined }}
                    >
                      Röntgen, 3D-skanning och AirFlow® — allt ingår.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </Section>
        )}

        {activeTab === "offer" && (
          <Section title="Erbjudande & hero">
            <Grid>
              <Field label="Hero-rubrik">
                <Textarea value={config.heroHeadline} onChange={(v) => update("heroHeadline", v)} rows={2} />
              </Field>
              <Field label="Hero-underrubrik">
                <Textarea value={config.heroSubheadline} onChange={(v) => update("heroSubheadline", v)} rows={3} />
              </Field>
              <Field label="Ordinarie pris">
                <Input value={config.originalPrice} onChange={(v) => update("originalPrice", v)} placeholder="1 895 kr" />
              </Field>
              <Field label="Erbjudandepris">
                <Input value={config.discountedPrice} onChange={(v) => update("discountedPrice", v)} placeholder="695 kr" />
              </Field>
              <Field label="Besparing">
                <Input value={config.savings} onChange={(v) => update("savings", v)} placeholder="1 200 kr" />
              </Field>
              <Field label="CTA-knapptext">
                <Input value={config.ctaText} onChange={(v) => update("ctaText", v)} placeholder="Säkra din tid nu – 695 kr" />
              </Field>
              <Field label="CTA-undertext">
                <Input value={config.ctaSubtext} onChange={(v) => update("ctaSubtext", v)} placeholder="Inga dolda avgifter · Avboka kostnadsfritt" />
              </Field>
              <Field label="Tillförlitlighetsmärke (stjärnor)">
                <Input value={config.trustBadge} onChange={(v) => update("trustBadge", v)} placeholder="4.8 / 5 av 400+ Google-recensioner" />
              </Field>
              <Field label="Nedre CTA-rubrik">
                <Textarea value={config.bottomCtaTitle} onChange={(v) => update("bottomCtaTitle", v)} rows={2} />
              </Field>
              <Field label="Nedre CTA-underrubrik">
                <Input value={config.bottomCtaSubtitle} onChange={(v) => update("bottomCtaSubtitle", v)} />
              </Field>
            </Grid>

            {/* ATB disclaimer toggle */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={config.showAtbDisclaimer}
                    onChange={(e) => update("showAtbDisclaimer", e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center border-2 transition-colors"
                    style={{
                      backgroundColor: config.showAtbDisclaimer ? "#C96A3A" : "transparent",
                      borderColor: config.showAtbDisclaimer ? "#C96A3A" : "#475569",
                    }}
                  >
                    {config.showAtbDisclaimer && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-slate-100 transition-colors">
                    Visa ATB-disclaimer vid priser
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Lägger till följande text i anslutning till alla priser och CTA-knappar på landningssidan:
                  </p>
                  <p className="text-xs text-slate-500 mt-2 italic leading-relaxed bg-slate-800 rounded-lg px-3 py-2">
                    &ldquo;Eventuellt innestående ATB (Allmänna tandvårdsbidraget) dras vid undersökningstillfället – ovanstående pris gäller alltså efter avdraget bidrag.&rdquo;
                  </p>
                </div>
              </label>
            </div>
          </Section>
        )}

        {activeTab === "included" && (
          <Section title="Vad som ingår">
            <Grid>
              <Field label="Sektionsrubrik">
                <Input value={config.includedTitle} onChange={(v) => update("includedTitle", v)} />
              </Field>
              <Field label="AirFlow-rubrik">
                <Input value={config.airflowTitle} onChange={(v) => update("airflowTitle", v)} />
              </Field>
              <Field label="AirFlow-brödtext">
                <Textarea value={config.airflowBody} onChange={(v) => update("airflowBody", v)} rows={4} />
              </Field>
            </Grid>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Ingående punkter</h3>
                <button type="button" onClick={addItem} className="text-xs font-semibold text-orange-400 hover:text-orange-300 border border-orange-800/50 hover:border-orange-600 rounded-lg px-3 py-1.5 transition-colors">
                  + Lägg till punkt
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {config.includedItems.map((item, i) => (
                  <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono w-5">{i + 1}</span>
                      <div className="flex-1">
                        <Input value={item.title} onChange={(v) => updateItem(i, { title: v })} placeholder="Titel" />
                      </div>
                      <Input value={item.value} onChange={(v) => updateItem(i, { value: v })} placeholder="Värde (valfritt)" />
                      <div className="flex gap-1 flex-shrink-0">
                        <button type="button" onClick={() => moveItem(i, -1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white rounded-lg hover:bg-slate-700 transition-colors" title="Flytta upp">↑</button>
                        <button type="button" onClick={() => moveItem(i, 1)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white rounded-lg hover:bg-slate-700 transition-colors" title="Flytta ner">↓</button>
                        <button type="button" onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors" title="Ta bort">✕</button>
                      </div>
                    </div>
                    <Textarea value={item.description} onChange={(v) => updateItem(i, { description: v })} placeholder="Beskrivning" rows={2} />
                  </div>
                ))}
                {config.includedItems.length === 0 && (
                  <p className="text-sm text-slate-600 text-center py-8">Inga punkter ännu. Klicka &ldquo;Lägg till punkt&rdquo;.</p>
                )}
              </div>
            </div>
          </Section>
        )}

        {activeTab === "dentist" && (
          <Section title="Tandläkare / teammedlem">
            <Grid>
              <Field label="Namn">
                <Input value={config.dentistName} onChange={(v) => update("dentistName", v)} placeholder="Hanna Sjögren" />
              </Field>
              <Field label="Titel">
                <Input value={config.dentistTitle} onChange={(v) => update("dentistTitle", v)} placeholder="Leg. tandläkare & grundare" />
              </Field>
              <Field label="Citat (blockquote)">
                <Textarea value={config.dentistQuote} onChange={(v) => update("dentistQuote", v)} rows={3} />
              </Field>
              <Field label="Biografi">
                <Textarea value={config.dentistBio} onChange={(v) => update("dentistBio", v)} rows={4} />
              </Field>
              <ImageField label="Porträttfoto" value={config.dentistImageUrl} onChange={(v) => update("dentistImageUrl", v)} slug={config.slug} />
            </Grid>
          </Section>
        )}

        {activeTab === "reviews" && (
          <Section title="Recensioner">

            {/* ── Source toggle ─────────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Recensionskälla</h3>
              <div className="grid grid-cols-2 gap-3">
                {(["custom", "elfsight"] as const).map((src) => {
                  const active = config.reviewsSource === src
                  const labels = {
                    custom: { title: "Egna recensioner", desc: "Handplocka och skriv recensioner manuellt" },
                    elfsight: { title: "Google Reviews via Elfsight", desc: "Bädda in live-recensioner från Google" },
                  }
                  return (
                    <label
                      key={src}
                      className="flex items-start gap-3 cursor-pointer rounded-xl p-4 border transition-colors"
                      style={{
                        borderColor: active ? "var(--accent-warm, #C96A3A)" : "#334155",
                        backgroundColor: active ? "color-mix(in srgb, var(--accent-warm, #C96A3A) 8%, transparent)" : "transparent",
                      }}
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input type="radio" name="reviewsSource" value={src} checked={active}
                          onChange={() => update("reviewsSource", src)} className="sr-only" />
                        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                          style={{ borderColor: active ? "var(--accent-warm, #C96A3A)" : "#475569" }}>
                          {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-warm, #C96A3A)" }} />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{labels[src].title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{labels[src].desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* ── Shared header fields ──────────────────────────── */}
            <Grid>
              <Field label="Sektionsrubrik">
                <Input value={config.reviewsTitle} onChange={(v) => update("reviewsTitle", v)} />
              </Field>
              <Field label="Underrubrik (antal & betyg)">
                <Input value={config.reviewsSubtitle} onChange={(v) => update("reviewsSubtitle", v)} placeholder="400+ recensioner · Genomsnitt 4.8/5 på Google" />
              </Field>
            </Grid>

            {/* ── Elfsight config ───────────────────────────────── */}
            {config.reviewsSource === "elfsight" && (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Elfsight-inbäddning</h3>
                <Field
                  label="Klistra in Elfsight-embed-koden"
                  hint="Klistra in hela embed-kodsblocken från Elfsight. Widget-ID:t parsas automatiskt."
                >
                  <textarea
                    rows={5}
                    placeholder={`<!-- Elfsight Google Reviews | Din klinik -->\n<script src="https://static.elfsight.com/platform/platform.js" async></script>\n<div class="elfsight-app-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" data-elfsight-app-lazy></div>`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    onChange={(e) => {
                      const match = e.target.value.match(/elfsight-app-([a-f0-9-]{36})/i)
                      if (match) updateIntegrations("elfsightWidgetId", match[1])
                    }}
                  />
                </Field>

                {config.integrations.elfsightWidgetId ? (
                  <div className="mt-3 flex items-center gap-2.5 bg-green-950/40 border border-green-800/50 rounded-xl px-4 py-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-green-400 flex-shrink-0" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <p className="text-xs text-green-300">
                      Widget-ID identifierat:{" "}
                      <span className="font-mono text-green-200">{config.integrations.elfsightWidgetId}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => updateIntegrations("elfsightWidgetId", "")}
                      className="ml-auto text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Rensa
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2.5 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
                    <p className="text-xs text-slate-500">Inget widget-ID hittades ännu. Klistra in koden ovan.</p>
                  </div>
                )}

                <p className="text-[11px] text-slate-600 mt-3">
                  Du kan också klistra in widget-ID:t manuellt under Integrationer → Spårning & widgets.
                </p>
              </div>
            )}

            {/* ── Custom review cards ───────────────────────────── */}
            {config.reviewsSource === "custom" && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Recensionskort</h3>
                  <button type="button" onClick={addReview} className="text-xs font-semibold text-orange-400 hover:text-orange-300 border border-orange-800/50 rounded-lg px-3 py-1.5 transition-colors">
                    + Lägg till
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {config.reviews.map((review, i) => (
                    <div key={i} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex flex-col gap-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <Input value={review.name} onChange={(v) => updateReview(i, { name: v })} placeholder="Namn" />
                          <Input value={review.location} onChange={(v) => updateReview(i, { location: v })} placeholder="Plats" />
                          <Input value={review.date} onChange={(v) => updateReview(i, { date: v })} placeholder="Datum (t.ex. 2 veckor sedan)" />
                        </div>
                        <select value={review.rating} onChange={(e) => updateReview(i, { rating: Number(e.target.value) })}
                          className="bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                        <button type="button" onClick={() => removeReview(i)} className="w-8 h-10 flex items-center justify-center text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors flex-shrink-0">✕</button>
                      </div>
                      <Textarea value={review.text} onChange={(v) => updateReview(i, { text: v })} placeholder="Recensionstext" rows={2} />
                    </div>
                  ))}
                  {config.reviews.length === 0 && (
                    <p className="text-sm text-slate-600 text-center py-8">Inga recensioner ännu. Klicka &ldquo;Lägg till&rdquo;.</p>
                  )}
                </div>
              </div>
            )}
          </Section>
        )}

        {activeTab === "clinic" && (
          <Section title="Kliniken">
            <Grid>
              <Field label="Sektionsrubrik">
                <Input value={config.clinicTitle} onChange={(v) => update("clinicTitle", v)} />
              </Field>
              <Field label="Sektionsbrödtext">
                <Textarea value={config.clinicBody} onChange={(v) => update("clinicBody", v)} rows={3} />
              </Field>
              <Field label="Ingen skyldighets-rubrik">
                <Input value={config.noObligationTitle} onChange={(v) => update("noObligationTitle", v)} />
              </Field>
              <Field label="Ingen skyldighets-brödtext">
                <Textarea value={config.noObligationBody} onChange={(v) => update("noObligationBody", v)} rows={3} />
              </Field>
            </Grid>
            <div className="mt-6 grid gap-6">
              <ImageField label="Hero-bild" value={config.heroImageUrl} onChange={(v) => update("heroImageUrl", v)} slug={config.slug} />
              <ImageField label="Interiörbild" value={config.interiorImageUrl} onChange={(v) => update("interiorImageUrl", v)} slug={config.slug} />
            </div>
          </Section>
        )}

        {activeTab === "integrations" && (
          <Section title="Integrationer">

            {/* ── Opt-in form copy ─────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Opt-in formulär</h3>
              <Grid>
                <Field label="Formulärrubrik" hint="Huvudrubrik i bokningsmodalen">
                  <Input
                    value={config.integrations.leadForm.headline}
                    onChange={(v) => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, headline: v } } }))}
                    placeholder="Säkra din plats – fyll i dina uppgifter"
                  />
                </Field>
                <Field label="Underrubrik" hint="Stödtext under rubriken">
                  <Textarea
                    value={config.integrations.leadForm.subheadline}
                    onChange={(v) => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, subheadline: v } } }))}
                    placeholder="En av våra koordinatorer kontaktar dig inom kort…"
                    rows={2}
                  />
                </Field>
                <Field label="Knapptext (CTA)" hint="Text på inskickningsknappen">
                  <Input
                    value={config.integrations.leadForm.ctaText}
                    onChange={(v) => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, ctaText: v } } }))}
                    placeholder="Bekräfta min tid →"
                  />
                </Field>
              </Grid>
            </div>

            {/* ── After submission ─────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Efter inskickning</h3>
              <div className="flex flex-col gap-3 mb-5">
                {(["thankyou", "url", "embed"] as const).map((type) => {
                  const labels = {
                    thankyou: { title: "Inbyggd tacksida", desc: "Visa ett tackmeddelande i modalen med instruktioner om att vänta på samtal. Rekommenderas." },
                    url: { title: "Vidarebefordra till länk", desc: "Skicka besökaren till en extern URL — t.ex. klinikins egna bokningssystem." },
                    embed: { title: "Kalender-embed", desc: "Visa en inbäddad kalender (Calendly, Bokadirekt, etc.) i modalen för omedelbar bokning." },
                  }
                  const active = config.integrations.leadForm.redirectType === type
                  return (
                    <label
                      key={type}
                      className="flex items-start gap-3 cursor-pointer rounded-xl p-4 border transition-colors"
                      style={{
                        borderColor: active ? "var(--accent-warm, #C96A3A)" : "#334155",
                        backgroundColor: active ? "color-mix(in srgb, var(--accent-warm, #C96A3A) 8%, transparent)" : "transparent",
                      }}
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="radio"
                          name="redirectType"
                          value={type}
                          checked={active}
                          onChange={() => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, redirectType: type } } }))}
                          className="sr-only"
                        />
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                          style={{ borderColor: active ? "var(--accent-warm, #C96A3A)" : "#475569" }}
                        >
                          {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-warm, #C96A3A)" }} />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{labels[type].title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{labels[type].desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Conditional URL / embed field */}
              {config.integrations.leadForm.redirectType === "url" && (
                <Field label="Vidarebefordrings-URL" hint="Besökaren skickas hit direkt efter inskickning">
                  <Input
                    value={config.integrations.leadForm.redirectUrl}
                    onChange={(v) => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, redirectUrl: v } } }))}
                    placeholder="https://din-klinik.se/boka"
                  />
                </Field>
              )}
              {config.integrations.leadForm.redirectType === "embed" && (
                <Field label="Kalender-embed URL" hint="Länk till Calendly, Bokadirekt eller annan kalender som stöder inbäddning">
                  <Input
                    value={config.integrations.leadForm.embedUrl}
                    onChange={(v) => setConfig((p) => ({ ...p, integrations: { ...p.integrations, leadForm: { ...p.integrations.leadForm, embedUrl: v } } }))}
                    placeholder="https://calendly.com/din-klinik/ny-patient"
                  />
                </Field>
              )}
            </div>

            {/* ── Make.com webhook ─────────────────────────────── */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Automatiseringar</h3>
              <Field
                label="Make.com Webhook URL"
                hint="Klistras in från Make → ett scenario med en Custom Webhook-trigger. Leaddata (namn, e-post, telefon, klinik, datum) skickas direkt efter varje inskickning."
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-[#6d2cb8]">
                    {/* Make.com "M" icon */}
                    <svg width="14" height="14" viewBox="0 0 32 32" fill="white" aria-hidden="true">
                      <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-6 5h12v2H10v-2zm0 4h12v2H10v-2zm0 4h8v2h-8v-2z"/>
                    </svg>
                  </div>
                  <Input
                    value={config.integrations.makeWebhookUrl}
                    onChange={(v) => updateIntegrations("makeWebhookUrl", v)}
                    placeholder="https://hook.eu2.make.com/xxxxxxxxxxxxxxxx"
                  />
                </div>
              </Field>
              {config.integrations.makeWebhookUrl && (
                <div className="mt-3 flex items-center gap-2.5 bg-purple-950/40 border border-purple-800/50 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                  <p className="text-xs text-purple-300">
                    Webhook aktiv — varje lead skickas automatiskt till Make med namn, e-post, telefon och klinikinfo.
                  </p>
                </div>
              )}
            </div>

            {/* ── Tracking & widgets ───────────────────────────── */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Spårning & widgets</h3>
              <Grid>
                <Field
                  label="Elfsight Google Reviews Widget-ID"
                  hint="Hämtas från din Elfsight-widget-kod. Lämna tomt för fallback-kortkarusellen."
                >
                  <Input value={config.integrations.elfsightWidgetId} onChange={(v) => updateIntegrations("elfsightWidgetId", v)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                </Field>
                <Field
                  label="Facebook Pixel-ID"
                  hint="Från Events Manager → Data Sources. PageView + Lead-event trackas automatiskt."
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1877F2" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <Input value={config.integrations.facebookPixelId} onChange={(v) => updateIntegrations("facebookPixelId", v)} placeholder="1234567890123456" />
                  </div>
                </Field>
              </Grid>
              {config.integrations.facebookPixelId && (
                <div className="mt-4 flex items-center gap-2.5 bg-blue-950/40 border border-blue-800/50 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <p className="text-xs text-blue-300">
                    Pixel <span className="font-mono text-blue-200">{config.integrations.facebookPixelId}</span> aktiv — PageView + Lead trackas automatiskt.
                  </p>
                </div>
              )}
            </div>

          </Section>
        )}

        {activeTab === "domain" && (
          <Section title="Anpassad domän">
            <div className="max-w-xl">
              <Field label="Anpassad domän" hint="T.ex. haga-tandlakeri.se — utan https:// och utan avslutande snedstreck">
                <Input value={config.customDomain} onChange={(v) => update("customDomain", v.replace(/^https?:\/\//, "").replace(/\/$/, ""))} placeholder="haga-tandlakeri.se" />
              </Field>

              <div className="mt-6 bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-sm font-bold text-white mb-3">DNS-konfiguration</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Lägg till en <code className="bg-slate-700 px-1 rounded text-orange-300">CNAME</code>-post hos din domänleverantör:
                </p>
                <div className="bg-slate-900 rounded-xl px-4 py-3 font-mono text-xs text-slate-300 grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Typ</span><span>CNAME</span>
                  <span className="text-slate-500">Namn/Värd</span><span>@</span>
                  <span className="text-slate-500">Värde/Pekar på</span><span className="text-orange-300">cname.vercel-dns.com</span>
                  <span className="text-slate-500">TTL</span><span>Auto</span>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Spara konfigurationen ovan, gå sedan till ditt Vercel-projekt och lägg till domänen under <strong className="text-slate-400">Settings → Domains</strong>. SSL provisioners automatiskt.
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  OBS: Domän-routing i middleware uppdateras vid nästa omstart av servern (dev) eller ny deployment (produktion).
                </p>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

// ── Layout helpers ─────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-6 pb-3 border-b border-slate-800">{title}</h2>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-5">{children}</div>
}
