// File: app/student/layout.tsx
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { StudentNav } from "@/components/layout/student-nav"
import { Loader2 } from "lucide-react"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { token, role, _hasHydrated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for store to hydrate before checking auth
    if (!_hasHydrated) return

    // Only run on client side
    if (typeof window !== 'undefined') {
      // Normalize role by converting to lowercase and trimming whitespace
      const normalizedRole = role?.toString().toLowerCase().trim()
      if (!token || normalizedRole !== 'student') {
        console.log('Redirecting to login. Token:', !!token, 'Role:', role, 'Normalized:', normalizedRole)
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
  }, [_hasHydrated, token, role, router])

  // Show loading state while checking auth or waiting for hydration
  if (!_hasHydrated || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentNav />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}