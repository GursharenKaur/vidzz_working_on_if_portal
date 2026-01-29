"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { FacultyNav } from "@/components/layout/faculty-nav"

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { role, token } = useAuthStore()

  useEffect(() => {
    if (!token || role !== "faculty") {
      router.push("/login")
    }
  }, [token, role, router])

  if (!token || role !== "faculty") {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <FacultyNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
