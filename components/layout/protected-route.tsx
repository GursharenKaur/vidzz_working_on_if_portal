"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "student" | "company" | "admin" | "faculty"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { token, role } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    if (requiredRole && role !== requiredRole) {
      router.push("/login")
    }
  }, [token, role, requiredRole, router])

  if (!token || (requiredRole && role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
