"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Briefcase, Clock, CheckCircle, XCircle, Sparkles, TrendingUp } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentDashboardPage() {
  const router = useRouter()
  const { token, role, user, _hasHydrated } = useAuthStore()

  // State for real data
  const [stats, setStats] = useState([
    { icon: Briefcase, label: "Total Applications", value: 0, color: "cyan" },
    { icon: Clock, label: "Applications Pending", value: 0, color: "purple" },
    { icon: CheckCircle, label: "Accepted", value: 0, color: "emerald" },
    { icon: XCircle, label: "Rejected", value: 0, color: "rose" },
  ])
  const [applicationData, setApplicationData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Auth guard
  useEffect(() => {
    if (!_hasHydrated) return
    if (!token || role !== "student") {
      const redirect = role !== "student" && token ? `/${role}/dashboard` : "/login";
      router.replace(redirect)
    }
  }, [_hasHydrated, token, role, router])

  // Fetch Data
  useEffect(() => {
    if (!_hasHydrated || !token) return

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()

        if (json.success) {
          processData(json.data)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
      } finally {
        setTimeout(() => setLoading(false), 800) // Small delay for smooth transition
      }
    }

    fetchData()
  }, [token])

  const processData = (apps: any[]) => {
    const total = apps.length
    const accepted = apps.filter(a => a.status?.toUpperCase() === 'ACCEPTED').length
    const rejected = apps.filter(a => a.status?.toUpperCase() === 'REJECTED').length
    const pending = apps.filter(a => ['PENDING', 'SHORTLISTED'].includes(a.status?.toUpperCase())).length

    setStats([
      { icon: Briefcase, label: "Total Applications", value: total, color: "cyan" },
      { icon: Clock, label: "Applications Pending", value: pending, color: "purple" },
      { icon: CheckCircle, label: "Accepted", value: accepted, color: "emerald" },
      { icon: XCircle, label: "Rejected", value: rejected, color: "rose" },
    ])

    setStatusData([
      { name: "Pending", value: pending, color: "#a855f7" },
      { name: "Accepted", value: accepted, color: "#10b981" },
      { name: "Rejected", value: rejected, color: "#f43f5e" },
    ].filter(d => d.value > 0))

    const monthMap: Record<string, { applications: number, accepted: number }> = {}

    apps.forEach(app => {
      const date = new Date(app.createdAt)
      const month = date.toLocaleString('default', { month: 'short' })

      if (!monthMap[month]) {
        monthMap[month] = { applications: 0, accepted: 0 }
      }
      monthMap[month].applications++
      if (app.status?.toUpperCase() === 'ACCEPTED') {
        monthMap[month].accepted++
      }
    })

    const chartData = Object.keys(monthMap).map(m => ({
      month: m,
      applications: monthMap[m].applications,
      accepted: monthMap[m].accepted
    }))

    setApplicationData(chartData)
  }

  if (!_hasHydrated) return null
  if (!token || role !== "student") return null

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <div className="flex items-center gap-2 text-cyan-500">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Dashboard</span>
          </div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{user?.name || "Student"}</span> 👋
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
            You have <span className="text-foreground font-bold">{stats[1].value} pending</span> applications.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="rounded-2xl border border-border bg-card px-6 py-3 shadow-sm transition-all duration-300">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Success Rate</p>
            <div className="mt-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-bold text-foreground">
                {stats[0].value > 0 ? Math.round((stats[2].value / stats[0].value) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            loading={loading}
            delay={idx * 0.1}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden border-border bg-card/50 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-foreground/[0.01] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground tracking-tight">Application Activity</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm font-medium">Historical submission trends</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {applicationData.length > 0 ? (
                      <BarChart data={applicationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                          </linearGradient>
                          <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 'bold' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 'bold' }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '12px',
                            color: 'hsl(var(--foreground))'
                          }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                          cursor={{ fill: 'hsl(var(--foreground))', opacity: 0.05 }}
                        />
                        <Legend iconType="circle" />
                        <Bar
                          dataKey="applications"
                          name="Submissions"
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        />
                        <Bar
                          dataKey="accepted"
                          name="Acceptances"
                          fill="url(#barGradient2)"
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        />
                      </BarChart>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="rounded-full bg-foreground/[0.03] p-4 border border-dashed border-border">
                          <Briefcase className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="text-xs uppercase font-black tracking-widest">No activity recorded</p>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full border-border bg-card/50 backdrop-blur-md">
            <CardHeader className="border-b border-border bg-foreground/[0.01] p-6">
              <CardTitle className="text-xl font-bold text-foreground tracking-tight">Application Status</CardTitle>
              <CardDescription className="text-muted-foreground text-sm font-medium">Distribution breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <div className="h-48 w-48 rounded-full border-8 border-t-cyan-500 border-border animate-spin" />
                </div>
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {statusData.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '12px',
                            color: 'hsl(var(--foreground))'
                          }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="rounded-full bg-foreground/[0.03] p-4 border border-dashed border-border">
                          <TrendingUp className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="text-xs uppercase font-black tracking-widest">No data available</p>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

