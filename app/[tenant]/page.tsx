import { notFound } from "next/navigation"
import { getTenant } from "@/lib/tenants"
import AnnouncementBar from "@/components/landing/AnnouncementBar"
import HeroBanner from "@/components/landing/HeroBanner"
import IncludedSection from "@/components/landing/IncludedSection"
import ReviewsSection from "@/components/landing/ReviewsSection"
import ClinicSection from "@/components/landing/ClinicSection"
import AuthoritySection from "@/components/landing/AuthoritySection"
import NoObligationSection from "@/components/landing/NoObligationSection"
import BottomCta from "@/components/landing/BottomCta"
import StickyMobileCta from "@/components/landing/StickyMobileCta"
import PageFooter from "@/components/landing/PageFooter"
import BookingModal from "@/components/landing/BookingModal"
import NavBar from "@/components/landing/NavBar"

interface Props {
  params: Promise<{ tenant: string }>
}

export default async function TenantPage({ params }: Props) {
  const { tenant } = await params
  const config = getTenant(tenant)
  if (!config) notFound()

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <AnnouncementBar config={config} />
      <NavBar config={config} />
      <HeroBanner config={config} />
      <IncludedSection config={config} />
      <ReviewsSection config={config} />
      <ClinicSection config={config} />
      <AuthoritySection config={config} />
      <NoObligationSection config={config} />
      <BottomCta config={config} />
      <PageFooter config={config} />
      <StickyMobileCta />
      <BookingModal />
    </main>
  )
}
