import type { TenantConfig } from "@/lib/tenant-types"

export default function AnnouncementBar({ config }: { config: TenantConfig }) {
  return (
    <div
      className="text-white text-center py-2.5 px-4 text-xs sm:text-sm font-semibold tracking-wide"
      style={{ backgroundColor: "var(--brand)" }}
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-1 h-1 rounded-full inline-block" style={{ backgroundColor: "var(--accent-warm)" }} aria-hidden="true" />
        {config.announcementBadge}
        <span className="w-1 h-1 rounded-full inline-block" style={{ backgroundColor: "var(--accent-warm)" }} aria-hidden="true" />
      </span>
    </div>
  )
}
