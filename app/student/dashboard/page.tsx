"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"

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
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react"

export default function StudentDashboardPage() {
  const router = useRouter()
  const { token, role, user, _hasHydrated } = useAuthStore()

  // State for real data
  const [stats, setStats] = useState([
    { icon: Briefcase, label: "Total Applications", value: 0 },
    { icon: Clock, label: "Applications Pending", value: 0 },
    { icon: CheckCircle, label: "Accepted", value: 0 },
    { icon: XCircle, label: "Rejected", value: 0 },
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
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const processData = (apps: any[]) => {
    // 1. Calculate Stats
    const total = apps.length
    const accepted = apps.filter(a => a.status?.toUpperCase() === 'ACCEPTED').length
    const rejected = apps.filter(a => a.status?.toUpperCase() === 'REJECTED').length
    const pending = apps.filter(a => ['PENDING', 'SHORTLISTED'].includes(a.status?.toUpperCase())).length

    setStats([
      { icon: Briefcase, label: "Total Applications", value: total },
      { icon: Clock, label: "Applications Pending", value: pending },
      { icon: CheckCircle, label: "Accepted", value: accepted },
      { icon: XCircle, label: "Rejected", value: rejected },
    ])

    // 2. Prepare Status Pie Chart Data
    setStatusData([
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Accepted", value: accepted, color: "#10b981" },
      { name: "Rejected", value: rejected, color: "#ef4444" },
    ].filter(d => d.value > 0))

    // 3. Prepare Monthly Bar Chart Data (simplified)
    // Group by month
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

  // ======================
  // ✅ FULL DASHBOARD UI
  // ======================
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name || "Student"} 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your internship application overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-cyan-400 opacity-75" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>
              Your application submissions and acceptances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {applicationData.length > 0 ? (
                <BarChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#0891b2" />
                  <Bar dataKey="accepted" fill="#10b981" />
                </BarChart>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No application history yet
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {statusData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No applications yet
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
