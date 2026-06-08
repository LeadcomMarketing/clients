// ============================================================
// LEADCOM MASTER TEMPLATE CONFIG
// Rebrand any clinic by editing this single file.
// ============================================================

export const config = {
  // ── Clinic identity ─────────────────────────────────────
  clinicName: "Haga Tandläkeri",
  clinicCity: "Stockholm",
  clinicAddress: "Hagaesplanaden 2B, Stockholm",

  // ── Integrations ────────────────────────────────────────
  integrations: {
    // Calendly booking link (replace with clinic's real URL)
    calendlyLink: "https://calendly.com/haga-tandlakeri/ny-patient",
    // Elfsight Google Reviews widget ID (replace with real ID)
    // Set to "" to hide the widget and show the fallback card carousel instead
    elfsightWidgetId: "",
  },

  // ── Announcement bar ────────────────────────────────────
  announcementBadge: "Erbjudande för nya patienter · Begränsat antal platser kvar",

  // ── Hero ────────────────────────────────────────────────
  heroHeadline: "Din första undersökning – komplett, trygg och 1 200 kr billigare",
  heroSubheadline:
    "Röntgenbilder, digital 3D-skanning, rengöring och gratis AirFlow® (värde 500 kr) — allt på ett och samma besök. Ordinarie pris 1 895 kr, nu 695 kr för nya patienter.",
  originalPrice: "1 895 kr",
  discountedPrice: "695 kr",
  savings: "1 200 kr",
  ctaText: "Säkra din tid nu – 695 kr",
  ctaSubtext: "Inga dolda avgifter · Avboka kostnadsfritt",
  trustBadge: "4.8 / 5 av 400+ Google-recensioner",

  // ── What's included ─────────────────────────────────────
  includedTitle: "Allt detta ingår i ditt första besök",
  includedItems: [
    {
      title: "Fullständig undersökning",
      description:
        "Genomgång av alla tänder och tandkött för en komplett bild av din munhälsa — ingenting missas.",
      value: "",
    },
    {
      title: "Röntgenbilder",
      description:
        "Vi röntgar dina tänder och fångar upp problem som inte syns för blotta ögat — tidigt ingripande sparar pengar.",
      value: "",
    },
    {
      title: "Digital 3D-skanning",
      description:
        "En 3D-modell av ditt bett skapas digitalt — snabbt, exakt och utan obehagliga avtrycksmassor.",
      value: "Värde 400 kr",
    },
    {
      title: "Lagning av en karies",
      description:
        "Hittar vi en karies under besöket lagar vi den direkt — utan extra kostnad och utan ett nytt besök.",
      value: "Värde 800 kr",
    },
    {
      title: "Professionell rengöring & puts",
      description:
        "Vi tar bort plack, tandsten och ytliga missfärgningar — du lämnar kliniken med fräscha, rena tänder.",
      value: "",
    },
    {
      title: "BONUS: AirFlow®-behandling",
      description:
        "Vår populäraste behandling — ett fint pulverbläster som tar bort fläckar och ger märkbart vitare tänder på nolltid.",
      value: "Värde 500 kr",
    },
  ],

  // ── AirFlow callout ─────────────────────────────────────
  airflowTitle: "Varför AirFlow® förändrar rengöringsupplevelsen",
  airflowBody:
    "AirFlow® kombinerar ett fint pulver, vatten och luft för att skonsamt men effektivt ta bort missfärgningar och plack — även i svåråtkomliga ställen som traditionell skrapning missar. Resultatet märks direkt: renare, fräschare och vitare tänder redan efter ett enda besök.",

  // ── Authority / Dentist ──────────────────────────────────
  dentistName: "Hanna Sjögren",
  dentistTitle: "Leg. tandläkare & grundare",
  dentistQuote:
    "Jag startade Haga Tandläkeri för att tandvård ska kännas trygg, enkel och välkomnande — för alla, inte bara de som redan älskar tandläkaren.",
  dentistBio:
    "Hanna har arbetat som tandläkare i över 15 år med specialisering inom estetisk och förebyggande tandvård. Hennes filosofi är enkel: rätt information och rätt behandling i tid förebygger problem innan de uppstår — och gör varje besök värt det.",

  // ── Reviews ─────────────────────────────────────────────
  reviewsTitle: "Vad våra patienter säger",
  reviewsSubtitle: "400+ recensioner · Genomsnitt 4.8/5 på Google",
  reviews: [
    {
      name: "Sofia Andersson",
      location: "Stockholm",
      rating: 5,
      text: "Jag var nervös men personalen var otroligt vänlig och proffsig. AirFlow®-behandlingen var häftig — tänderna känns som nya! Kommer definitivt tillbaka.",
      date: "2 veckor sedan",
    },
    {
      name: "Erik Lindqvist",
      location: "Solna",
      rating: 5,
      text: "Bästa tandläkarbesöket jag haft. Snabbt, smidigt och helt smärtfritt. Erbjudandet var dessutom väldigt bra — fick otroligt mycket för pengarna.",
      date: "1 månad sedan",
    },
    {
      name: "Maria Holm",
      location: "Kungsholmen",
      rating: 5,
      text: "Superproffsig klinik med moderna lokaler. Hanna är lugn och tydlig och förklarar allt under besöket. Kände mig i trygga händer hela tiden.",
      date: "3 veckor sedan",
    },
  ],

  // ── Clinic section ───────────────────────────────────────
  clinicTitle: "En klinik du faktiskt ser fram emot att besöka",
  clinicBody:
    "Vår klinik är designad för att vara modern, ljus och trivsam — med den senaste tekniken och ett team som sätter din komfort i centrum, från första steget in.",

  // ── No-obligation ────────────────────────────────────────
  noObligationTitle: "Prova oss utan risk — helt utan förpliktelser",
  noObligationBody:
    "Det finns inga dolda kostnader, inga inlåsningskontrakt och ingen press på att fortsätta. Nya patient-erbjudandet finns till för att du ska kunna prova oss och se att du är nöjd — resten bestämmer du.",

  // ── Bottom CTA ───────────────────────────────────────────
  bottomCtaTitle:
    "Komplett undersökning med röntgen, 3D-skanning, rengöring & AirFlow®",
  bottomCtaSubtitle: "Nytt patient-erbjudande · Begränsat antal platser",
} as const
