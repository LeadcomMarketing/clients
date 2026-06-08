// Curated list of Google Fonts suitable for clinic/medical branding.
// Add or remove entries here — both admin dropdowns share this list.

export interface GoogleFont {
  label: string
  value: string  // exact family name as used in CSS / Google Fonts URL
  category: "sans-serif" | "serif" | "display"
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // ── Modern sans-serif ────────────────────────────────────────
  { label: "Plus Jakarta Sans",  value: "Plus Jakarta Sans",  category: "sans-serif" },
  { label: "Inter",              value: "Inter",              category: "sans-serif" },
  { label: "DM Sans",            value: "DM Sans",            category: "sans-serif" },
  { label: "Outfit",             value: "Outfit",             category: "sans-serif" },
  { label: "Nunito",             value: "Nunito",             category: "sans-serif" },
  { label: "Poppins",            value: "Poppins",            category: "sans-serif" },
  { label: "Raleway",            value: "Raleway",            category: "sans-serif" },
  { label: "Montserrat",         value: "Montserrat",         category: "sans-serif" },
  { label: "Lato",               value: "Lato",               category: "sans-serif" },
  { label: "Open Sans",          value: "Open Sans",          category: "sans-serif" },
  { label: "Roboto",             value: "Roboto",             category: "sans-serif" },
  { label: "Source Sans 3",      value: "Source Sans 3",      category: "sans-serif" },
  { label: "Rubik",              value: "Rubik",              category: "sans-serif" },
  { label: "Karla",              value: "Karla",              category: "sans-serif" },
  { label: "Jost",               value: "Jost",               category: "sans-serif" },
  { label: "Albert Sans",        value: "Albert Sans",        category: "sans-serif" },
  { label: "Figtree",            value: "Figtree",            category: "sans-serif" },
  { label: "Syne",               value: "Syne",               category: "sans-serif" },
  { label: "Hind",               value: "Hind",               category: "sans-serif" },
  // ── Serif ────────────────────────────────────────────────────
  { label: "Playfair Display",   value: "Playfair Display",   category: "serif" },
  { label: "Lora",               value: "Lora",               category: "serif" },
  { label: "Merriweather",       value: "Merriweather",       category: "serif" },
  { label: "Libre Baskerville",  value: "Libre Baskerville",  category: "serif" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond", category: "serif" },
  { label: "Fraunces",           value: "Fraunces",           category: "serif" },
  { label: "EB Garamond",        value: "EB Garamond",        category: "serif" },
  { label: "Crimson Pro",        value: "Crimson Pro",        category: "serif" },
] as const

/** Build a Google Fonts stylesheet URL for one or two families */
export function buildGoogleFontsUrl(families: string[]): string | null {
  const unique = [...new Set(families.filter(Boolean))]
  if (unique.length === 0) return null
  const params = unique
    .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}
