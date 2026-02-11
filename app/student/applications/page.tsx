"use client"

import { useState, useEffect } from "react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Loader2, Building2, ChevronRight, Search, Inbox, Sparkles, Filter } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth"
import { studentApi } from "@/lib/api/student"
import { GlassCard } from "@/components/shared/glass-card"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: "Pending Review", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  shortlisted: { label: "Shortlisted", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  accepted: { label: "Offer Accepted", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  rejected: { label: "Not Selected", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
}

export default function ApplicationsPage() {
  const { token } = useAuthStore()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchApplications = async () => {
      try {
        setIsLoading(true)
        const data = await studentApi.getApplications()
        if (data) {
          setApplications(data)
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err)
      } finally {
        setTimeout(() => setIsLoading(false), 500)
      }
    }

    fetchApplications()
  }, [token])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4 bg-foreground/5" />
          <Skeleton className="h-5 w-1/3 bg-foreground/5" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full bg-foreground/5 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Status Tracker</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Applications</h1>
          <p className="text-muted-foreground font-medium">Track the progress of your submitted applications.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-foreground/5 border border-border rounded-full px-4 py-2 flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground/60">All Status</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 rounded-[32px] border border-dashed border-border flex flex-col items-center justify-center text-center gap-6 bg-foreground/[0.02]"
            >
              <div className="p-6 rounded-full bg-foreground/5">
                <Inbox className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">No applications yet</p>
                <p className="text-muted-foreground max-w-[280px] text-sm font-medium">Your application journey hasn't started. Explore roles and start applying!</p>
              </div>
              <Link href="/student/companies">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 font-bold h-11 border-none transition-transform hover:scale-105 active:scale-95">
                  Browse Internships
                </Button>
              </Link>
            </motion.div>
          ) : (
            applications.map((app, idx) => {
              const status = app.status.toLowerCase()
              const config = statusConfig[status] || statusConfig.pending
              const showLogo = !!app.roleId?.companyId?.logo
              const companyLogo = showLogo
                ? (app.roleId.companyId.logo.startsWith('http') ? app.roleId.companyId.logo : `${process.env.NEXT_PUBLIC_BACKEND_URL}${app.roleId.companyId.logo}`)
                : null

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  layout
                >
                  <GlassCard className="group p-6 hover:bg-foreground/[0.04] border-border bg-card/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl border border-border bg-foreground/5 p-2.5 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                          {showLogo ? (
                            <img
                              src={companyLogo!}
                              alt="Logo"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-cyan-500 transition-colors truncate">
                            {app.roleId?.companyId?.name || "Company"}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium truncate">{app.roleId?.title || "Position"}</p>

                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                              <Calendar className="h-3 w-3" />
                              Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${config.color.replace('text-', 'bg-')} shadow-[0_0_8px] shadow-current`} />
                          <span className={`${config.color} text-[10px] font-black uppercase tracking-[0.15em]`}>
                            {config.label}
                          </span>
                        </div>

                        <Link href={`/student/companies/${app.roleId?.companyId?._id}`}>
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-foreground/5 border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


