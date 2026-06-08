import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Script from "next/script"
import { getDomainsMap, getTenant } from "@/lib/tenants"
import { fetchGoogleRating } from "@/lib/google-places"
import { buildGoogleFontsUrl } from "@/lib/google-fonts"
import { TenantConfigProvider } from "@/context/TenantConfigContext"
import { BookingModalProvider } from "@/context/BookingModalContext"
import AnnouncementBar from "@/components/landing/AnnouncementBar"
import NavBar from "@/components/landing/NavBar"
import HeroBanner from "@/components/landing/HeroBanner"
import IncludedSection from "@/components/landing/IncludedSection"
import ReviewsSection from "@/components/landing/ReviewsSection"
import ClinicSection from "@/components/landing/ClinicSection"
import AuthoritySection from "@/components/landing/AuthoritySection"
import NoObligationSection from "@/components/landing/NoObligationSection"
import BottomCta from "@/components/landing/BottomCta"
import PageFooter from "@/components/landing/PageFooter"
import StickyMobileCta from "@/components/landing/StickyMobileCta"
import BookingModal from "@/components/landing/BookingModal"

export const dynamic = "force-dynamic"

export default async function RootPage() {
  const h = await headers()
  const host = (h.get("host") ?? "").split(":")[0]

  const tenantSlug = getDomainsMap()[host]

  if (tenantSlug) {
    const config = getTenant(tenantSlug)
    if (config) {
      // Render the landing page inline — URL stays as the custom domain root (no /slug in URL)
      const googleRating = config.integrations.googlePlaceId
        ? await fetchGoogleRating(config.integrations.googlePlaceId)
        : null

      const { brandColor, accentColor, pageBg, sectionBg, fontHeadline, fontBody } = config.branding
      const cssVars = {
        "--brand": brandColor, "--accent-warm": accentColor,
        "--background": pageBg, "--secondary": sectionBg,
        "--brand-light": brandColor + "18", "--accent-warm-light": accentColor + "1A",
      } as React.CSSProperties

      const fontsUrl = buildGoogleFontsUrl([fontBody, fontHeadline])
      const fontCss = [
        fontBody     && `.lc-tenant,.lc-tenant p,.lc-tenant span,.lc-tenant button{font-family:'${fontBody}',var(--font-sans)}`,
        fontHeadline && `.lc-tenant h1,.lc-tenant h2,.lc-tenant h3,.lc-tenant h4{font-family:'${fontHeadline}',var(--font-sans)}`,
      ].filter(Boolean).join("\n")

      return (
        <TenantConfigProvider config={config}>
          <BookingModalProvider>
            {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
            {fontCss  && <style dangerouslySetInnerHTML={{ __html: fontCss }} />}
            <div className="lc-tenant w-full overflow-x-hidden" style={cssVars}>
              <main className="min-h-screen w-full pb-20 md:pb-0" style={{ backgroundColor: "var(--background)" }}>
                <AnnouncementBar config={config} />
                <NavBar config={config} />
                <HeroBanner config={config} googleRating={googleRating} />
                <IncludedSection config={config} />
                <ReviewsSection config={config} />
                <ClinicSection config={config} />
                <AuthoritySection config={config} />
                <NoObligationSection config={config} />
                <BottomCta config={config} />
                <PageFooter config={config} />
              </main>
              <StickyMobileCta />
              <BookingModal />
            </div>
            {config.reviewsSource === "elfsight" && config.integrations.elfsightWidgetId && (
              <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
            )}
            {config.integrations.facebookPixelId && (
              <>
                <Script id={`fb-pixel-root`} strategy="afterInteractive">{`
                  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init','${config.integrations.facebookPixelId}');fbq('track','PageView');
                `}</Script>
                <noscript><img height="1" width="1" style={{ display:"none" }} src={`https://www.facebook.com/tr?id=${config.integrations.facebookPixelId}&ev=PageView&noscript=1`} alt="" /></noscript>
              </>
            )}
          </BookingModalProvider>
        </TenantConfigProvider>
      )
    }
  }

  // Default: Leadcom admin console
  redirect("/admin")
}
