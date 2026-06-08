// Zero dependencies — pure test route
export function GET() {
  return Response.json({ pong: true, time: new Date().toISOString() })
}
