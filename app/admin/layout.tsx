"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { AdminNav } from "@/components/layout/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { token, role } = useAuthStore()

  useEffect(() => {
    if (!token || role !== "admin") {
      router.push("/login")
    }
  }, [token, role, router])

  if (!token || role !== "admin") return null

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
