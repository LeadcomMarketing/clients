import { redirect } from "next/navigation"

// clients.leadcom.no always goes to admin (or login if not authenticated)
export default function RootPage() {
  redirect("/admin")
}
