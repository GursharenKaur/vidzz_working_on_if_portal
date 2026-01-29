"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { CompanyNav } from "@/components/layout/company-nav"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { token, role, _hasHydrated } = useAuthStore()

  useEffect(() => {
    // Wait for store to hydrate before checking auth
    if (!_hasHydrated) return

    if (!token || role !== "company") {
      router.push("/login")
    }
  }, [_hasHydrated, token, role, router])

  // Wait for hydration before rendering
  if (!_hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!token || role !== "company") return null

  return (
    <div className="flex h-screen bg-background">
      <CompanyNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
