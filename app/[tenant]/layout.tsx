import type { Metadata } from "next"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getTenant } from "@/lib/tenants"
import { TenantConfigProvider } from "@/context/TenantConfigContext"
import { BookingModalProvider } from "@/context/BookingModalContext"
import { buildGoogleFontsUrl } from "@/lib/google-fonts"

interface Props {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params
  const config = getTenant(tenant)
  if (!config) return {}
  return {
    title: `${config.clinicName} – Komplett tandvård i ${config.clinicCity}`,
    description: `Boka din tandundersökning med röntgenbilder, 3D-skanning och AirFlow®-behandling. Spara ${config.savings} – nu endast ${config.discountedPrice}.`,
    robots: { index: false, follow: false },
  }
}

export default async function TenantLayout({ children, params }: Props) {
  const { tenant } = await params
  const config = getTenant(tenant)
  if (!config) notFound()

  const { brandColor, accentColor, pageBg, sectionBg, fontHeadline, fontBody } = config.branding

  // ── CSS variable overrides ────────────────────────────────────
  const cssVars = {
    "--brand":             brandColor,
    "--accent-warm":       accentColor,
    "--background":        pageBg,
    "--secondary":         sectionBg,
    "--brand-light":       brandColor + "18",
    "--accent-warm-light": accentColor + "1A",
  } as React.CSSProperties

  // ── Google Fonts ──────────────────────────────────────────────
  const fontsUrl = buildGoogleFontsUrl([fontBody, fontHeadline])

  // ── Scoped font CSS ───────────────────────────────────────────
  // Applied to elements inside .lc-tenant so we don't bleed into admin/other routes.
  const fontCss = [
    fontBody     && `.lc-tenant, .lc-tenant p, .lc-tenant span, .lc-tenant button, .lc-tenant a, .lc-tenant li { font-family: '${fontBody}', var(--font-sans); }`,
    fontHeadline && `.lc-tenant h1, .lc-tenant h2, .lc-tenant h3, .lc-tenant h4, .lc-tenant h5 { font-family: '${fontHeadline}', var(--font-sans); }`,
  ].filter(Boolean).join("\n")

  return (
    <TenantConfigProvider config={config}>
      <BookingModalProvider>
        {/* Google Fonts — single request for both families */}
        {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

        {/* Scoped font overrides */}
        {fontCss && <style dangerouslySetInnerHTML={{ __html: fontCss }} />}

        {/* CSS variable overrides + tenant scope class */}
        <div className="lc-tenant w-full overflow-x-hidden" style={cssVars}>
          {children}
        </div>

        {/* Elfsight platform script — loaded whenever any Elfsight widget is active */}
        {(
          (config.reviewsSource === "elfsight" && config.integrations.elfsightWidgetId) ||
          config.trustBadgeElfsightId
        ) && (
          <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
        )}

        {/* Facebook Pixel */}
        {config.integrations.facebookPixelId && (
          <>
            <Script id={`fb-pixel-${config.slug}`} strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init','${config.integrations.facebookPixelId}');
                fbq('track','PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img height="1" width="1" style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${config.integrations.facebookPixelId}&ev=PageView&noscript=1`}
                alt="" />
            </noscript>
          </>
        )}
      </BookingModalProvider>
    </TenantConfigProvider>
  )
}
