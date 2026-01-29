"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"

export default function Home() {
  const router = useRouter()
  const { token, role, _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!_hasHydrated) return // Wait for store to hydrate from localStorage

    if (token && role) {
      if (role === "student") router.push("/student/dashboard")
      else if (role === "company") router.push("/company/dashboard")
      else if (role === "admin") router.push("/admin/dashboard")
      else if (role === "faculty") router.push("/faculty/dashboard")
    } else {
      router.push("/login")
    }
  }, [_hasHydrated, token, role, router])

  return null
}
