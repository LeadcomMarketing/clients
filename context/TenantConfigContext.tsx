"use client"

import { createContext, useContext } from "react"
import type { TenantConfig } from "@/lib/tenant-types"

const TenantConfigContext = createContext<TenantConfig | null>(null)

export function TenantConfigProvider({
  config,
  children,
}: {
  config: TenantConfig
  children: React.ReactNode
}) {
  return (
    <TenantConfigContext.Provider value={config}>
      {children}
    </TenantConfigContext.Provider>
  )
}

export function useTenantConfig(): TenantConfig {
  const ctx = useContext(TenantConfigContext)
  if (!ctx) throw new Error("useTenantConfig must be used inside <TenantConfigProvider>")
  return ctx
}
