// ================================================================
// LEADCOM TENANT TYPES
// Single source of truth for the TenantConfig shape.
// ================================================================

export interface TenantBranding {
  /** Primary dark colour — nav, headings, dark cards. Default: #1E3A5F */
  brandColor: string
  /** CTA / highlight colour — buttons, badges. Default: #C96A3A */
  accentColor: string
  /** Main page background. Default: #F8F5F1 */
  pageBg: string
  /** Alternate section background. Default: #F0ECE7 */
  sectionBg: string
  /** Google Font family for headings (h1–h5). Leave empty to inherit body font. */
  fontHeadline: string
  /** Google Font family for body text, buttons, and UI. Leave empty for Plus Jakarta Sans. */
  fontBody: string
  /** URL of the clinic logo image. When set, replaces the text name in nav and footer. */
  logoUrl: string
}

export interface IncludedItem {
  title: string
  description: string
  /** Optional value callout, e.g. "Värde 500 kr" */
  value: string
}

export interface Review {
  name: string
  location: string
  rating: number
  text: string
  date: string
}

export interface TenantConfig {
  // ── Meta ───────────────────────────────────────────────────────
  slug: string
  customDomain: string
  createdAt: string

  // ── Clinic identity ────────────────────────────────────────────
  clinicName: string
  clinicCity: string
  clinicAddress: string

  // ── Branding ───────────────────────────────────────────────────
  branding: TenantBranding

  // ── Integrations ───────────────────────────────────────────────
  integrations: {
    elfsightWidgetId: string
    facebookPixelId: string
    /**
     * Google Place ID for this clinic.
     * When set (and GOOGLE_PLACES_API_KEY is configured), the hero trust badge
     * shows a live rating fetched from the Places API instead of a static widget.
     * Find yours at: https://developers.google.com/maps/documentation/places/web-service/place-id
     */
    googlePlaceId: string
    /** Make.com (or any) webhook URL. POSTed with lead data on every opt-in. */
    makeWebhookUrl: string
    leadForm: {
      /** Headline shown at the top of the opt-in modal */
      headline: string
      /** Supporting line below the headline */
      subheadline: string
      /** Submit button label */
      ctaText: string
      /**
       * What happens after a successful form submission:
       * - "thankyou" → built-in thank-you screen inside the modal
       * - "url"      → hard redirect to redirectUrl
       * - "embed"    → swap to a calendar embed (embedUrl) inside the modal
       */
      redirectType: "thankyou" | "url" | "embed"
      /** Used when redirectType === "url" */
      redirectUrl: string
      /** Used when redirectType === "embed" (Calendly, Bokadirekt, etc.) */
      embedUrl: string
    }
  }

  // ── Announcement bar ───────────────────────────────────────────
  announcementBadge: string

  // ── Hero ───────────────────────────────────────────────────────
  heroHeadline: string
  heroSubheadline: string
  originalPrice: string
  discountedPrice: string
  savings: string
  /** Global fallback CTA text — used when a specific placement label is empty */
  ctaText: string
  ctaSubtext: string
  /** Per-placement CTA labels — each can have its own copy angle */
  ctaLabels: {
    /** NavBar top-right button */
    nav: string
    /** Hero main button — show urgency + price */
    hero: string
    /** After the included-items list — commitment angle */
    afterIncluded: string
    /** After the reviews — social proof conversion angle */
    afterReviews: string
    /** Bottom CTA section — final urgency */
    bottom: string
    /** Sticky mobile bar — must be short */
    sticky: string
  }
  /** Text shown in the star-rating pill in the hero. Set empty to hide the badge. */
  trustBadge: string
  /** When set, renders an Elfsight badge widget instead of the text pill. */
  trustBadgeElfsightId: string
  heroImageUrl: string

  // ── Included items ─────────────────────────────────────────────
  includedTitle: string
  includedItems: IncludedItem[]

  // ── AirFlow callout ────────────────────────────────────────────
  airflowTitle: string
  airflowBody: string

  // ── Clinic section ─────────────────────────────────────────────
  clinicTitle: string
  clinicBody: string
  interiorImageUrl: string

  // ── Dentist / authority ────────────────────────────────────────
  dentistName: string
  dentistTitle: string
  dentistQuote: string
  dentistBio: string
  dentistImageUrl: string

  // ── Reviews ────────────────────────────────────────────────────
  /** "custom" = hand-curated cards | "elfsight" = live Google Reviews widget */
  reviewsSource: "custom" | "elfsight"
  reviewsTitle: string
  reviewsSubtitle: string
  reviews: Review[]

  // ── No-obligation ──────────────────────────────────────────────
  noObligationImageUrl: string
  noObligationTitle: string
  noObligationBody: string

  // ── Bottom CTA ─────────────────────────────────────────────────
  bottomCtaTitle: string
  bottomCtaSubtitle: string

  // ── ATB disclaimer ─────────────────────────────────────────────
  /** When true, shows the ATB (Allmänna tandvårdsbidraget) disclaimer near all prices. */
  showAtbDisclaimer: boolean
}

/** Lightweight summary used in the admin tenant list */
export type TenantMeta = Pick<
  TenantConfig,
  'slug' | 'clinicName' | 'clinicCity' | 'customDomain' | 'createdAt'
>

// ── ATB disclaimer text ────────────────────────────────────────
export const ATB_DISCLAIMER =
  "Eventuellt innestående ATB (Allmänna tandvårdsbidraget) dras vid undersökningstillfället – ovanstående pris gäller alltså efter avdraget bidrag."

// ── Default branding (Leadcom warm palette) ────────────────────
export const DEFAULT_BRANDING: TenantBranding = {
  brandColor: '#1E3A5F',
  accentColor: '#C96A3A',
  pageBg: '#F8F5F1',
  sectionBg: '#F0ECE7',
  fontHeadline: '',
  fontBody: '',
  logoUrl: '',
}

export const EMPTY_TENANT: Omit<TenantConfig, 'slug' | 'createdAt'> = {
  customDomain: '',
  clinicName: '',
  clinicCity: '',
  clinicAddress: '',
  branding: { ...DEFAULT_BRANDING },
  integrations: {
    elfsightWidgetId: '',
    facebookPixelId: '',
    googlePlaceId: '',
    makeWebhookUrl: '',
    leadForm: {
      headline: 'Säkra din plats – fyll i dina uppgifter',
      subheadline: 'En av våra koordinatorer kontaktar dig inom kort för att bekräfta din tid.',
      ctaText: 'Bekräfta min tid →',
      redirectType: 'thankyou' as const,
      redirectUrl: '',
      embedUrl: '',
    },
  },
  announcementBadge: 'Erbjudande för nya patienter · Begränsat antal platser kvar',
  heroHeadline: '',
  heroSubheadline: '',
  originalPrice: '',
  discountedPrice: '',
  savings: '',
  ctaText: 'Säkra din tid nu',
  ctaSubtext: 'Inga dolda avgifter · Avboka kostnadsfritt',
  ctaLabels: {
    nav: 'Boka tid →',
    hero: 'Säkra din tid nu',
    afterIncluded: 'Ja, jag vill boka detta →',
    afterReviews: 'Bli nästa nöjda patient →',
    bottom: 'Boka nu – ta chansen',
    sticky: 'Boka nu →',
  },
  trustBadge: '4.8 / 5 av Google-recensioner',
  trustBadgeElfsightId: '',
  heroImageUrl: '',
  includedTitle: 'Allt detta ingår i ditt första besök',
  includedItems: [],
  airflowTitle: '',
  airflowBody: '',
  clinicTitle: '',
  clinicBody: '',
  interiorImageUrl: '',
  dentistName: '',
  dentistTitle: '',
  dentistQuote: '',
  dentistBio: '',
  dentistImageUrl: '',
  reviewsSource: 'custom' as const,
  reviewsTitle: 'Vad våra patienter säger',
  reviewsSubtitle: '',
  reviews: [],
  noObligationImageUrl: '',
  noObligationTitle: 'Prova oss utan risk — helt utan förpliktelser',
  noObligationBody: '',
  bottomCtaTitle: '',
  bottomCtaSubtitle: 'Nytt patient-erbjudande · Begränsat antal platser',
  showAtbDisclaimer: false,
}
