export interface GoogleRating {
  rating: number
  totalRatings: number
}

/**
 * Fetch a clinic's Google rating and review count via the Places API.
 * Result is cached for 24 h by Next.js fetch deduplication.
 *
 * Requires GOOGLE_PLACES_API_KEY in .env.local
 * Requires the clinic's Google Place ID in config.integrations.googlePlaceId
 *
 * Finding a Place ID:
 *   1. Go to https://developers.google.com/maps/documentation/places/web-service/place-id
 *   2. Or open Google Maps → find the clinic → share → embed → extract from the URL
 *   3. Or use: https://www.google.com/maps/search/?api=1&query=CLINIC+NAME
 *      then look at the URL for the CID / place_id parameter
 */
export async function fetchGoogleRating(
  placeId: string
): Promise<GoogleRating | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || !placeId) return null

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=rating%2Cuser_ratings_total` +
      `&key=${apiKey}`

    const res = await fetch(url, {
      // Cache for 24 hours — revalidates in the background (ISR)
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null

    const data = await res.json()

    if (data.status !== "OK" || !data.result) return null

    return {
      rating: data.result.rating ?? 0,
      totalRatings: data.result.user_ratings_total ?? 0,
    }
  } catch {
    return null
  }
}
