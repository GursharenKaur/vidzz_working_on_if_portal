"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Clock, CheckCircle, Loader2, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { StatCard } from "@/components/shared/stat-card"
import { GlassCard } from "@/components/shared/glass-card"

const iconMap: Record<string, any> = {
  "Active Roles": Briefcase,
  "Total Applications": Users,
  "Pending Review": Clock,
  "Accepted": CheckCircle,
}

const colorMap: Record<string, string> = {
  "Active Roles": "cyan",
  "Total Applications": "purple",
  "Pending Review": "rose",
  "Accepted": "emerald",
}

export default function CompanyDashboard() {
  const router = useRouter()
  const { token, role, user, _hasHydrated } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: [],
    applicationsData: [],
    rolePerformance: []
  })

  useEffect(() => {
    if (!_hasHydrated) return
    if (!token || role !== "company") {
      const redirect = role !== "company" && token ? `/${role}/dashboard` : "/login";
      router.replace(redirect)
    }
  }, [_hasHydrated, token, role, router])

  useEffect(() => {
    if (!_hasHydrated || !token || role !== "company") return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        if (json.success) {
          setDashboardData(json.data)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard analytics", err)
      } finally {
        setTimeout(() => setLoading(false), 800)
      }
    }

    fetchAnalytics()
  }, [token, _hasHydrated, role])

  if (!_hasHydrated || !token || role !== "company") return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20"
        >
          <Loader2 className="h-10 w-10 text-cyan-500" />
        </motion.div>
        <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs animate-pulse">
          Assembling recruiter insights...
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Dashboard</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">{user?.name || 'Recruiter'}</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl text-lg">
              Here's your hiring pipeline at a glance.
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card border border-border rounded-2xl px-6 py-3 flex items-center gap-4 cursor-default group transition-all"
        >
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Growth Index</p>
            <p className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors">+12.5% this month</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat: any, idx: number) => (
          <StatCard
            key={stat.label}
            icon={iconMap[stat.label] || Briefcase}
            label={stat.label}
            value={stat.value}
            delay={idx * 0.1}
            color={colorMap[stat.label]}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 rounded-[32px]" delay={0.2}>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">Application Activity</h3>
              <p className="text-xs text-muted-foreground font-medium">Weekly application counts</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-cyan-500" /> Total</span>
              <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Accepted </span>
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.applicationsData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="week"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <YAxis
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                />
                <Area
                  type="monotone"
                  dataKey="accepted"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAcc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 rounded-[32px]" delay={0.3}>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">Role Distribution</h3>
              <p className="text-xs text-muted-foreground font-medium">Applicants per job role</p>
            </div>
            <button className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors" onClick={() => router.push('/company/roles')}>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="h-[350px] w-full mt-4">
            {dashboardData.rolePerformance?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.rolePerformance} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="role"
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                  />
                  <YAxis
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--foreground))', opacity: 0.05 }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="applications" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 bg-foreground/[0.02] rounded-[32px] border border-dashed border-border">
                <Users className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Awaiting Role Analytics</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden border-border bg-card/50 backdrop-blur-md rounded-[32px]" delay={0.4}>
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground tracking-tight">Recent Applications</h3>
            <p className="text-xs text-muted-foreground font-medium">Latest talent acquisitions and evaluations</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/company/applicants')} className="text-cyan-500 hover:text-cyan-600 font-bold text-[10px] uppercase tracking-widest">
            Full Registry
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.01]">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Candidate</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Role</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Activity</th>
              </tr>
            </thead>
            <tbody>
              {(dashboardData.recentApplicants || []).length > 0 ? (
                dashboardData.recentApplicants.map((app: any, idx: number) => (
                  <tr key={idx} className="border-t border-border hover:bg-foreground/[0.02] transition-colors group">
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition-colors uppercase tracking-tight">{app.name}</p>
                    </td>
                    <td className="px-8 py-4 px-8 text-xs font-medium text-muted-foreground">
                      {app.role}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Recent</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Clock className="h-8 w-8 text-muted-foreground/20" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No recent activity detected</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}


