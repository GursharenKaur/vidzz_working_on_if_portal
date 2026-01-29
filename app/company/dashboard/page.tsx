"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Clock, CheckCircle, Loader2 } from "lucide-react"
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
} from "recharts"

const iconMap: Record<string, any> = {
  "Active Roles": Briefcase,
  "Total Applications": Users,
  "Pending Review": Clock,
  "Accepted": CheckCircle,
}

export default function CompanyDashboard() {
  const router = useRouter()
  const { token, role, _hasHydrated } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>({
    stats: [],
    applicationsData: [],
    rolePerformance: []
  })

  // Auth guard
  useEffect(() => {
    if (!_hasHydrated) return
    if (!token || role !== "company") {
      const redirect = role !== "company" && token ? `/${role}/dashboard` : "/login";
      router.replace(redirect)
    }
  }, [_hasHydrated, token, role, router])

  // Fetch Data
  useEffect(() => {
    if (!_hasHydrated || !token || role !== "company") return

    const fetchAnalytics = async () => {
      try {
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
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [token, _hasHydrated, role])

  if (!_hasHydrated) return null
  if (!token || role !== "company") return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard insights...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground">Manage your internship program and applicants</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardData.stats.map((stat: any) => {
          const Icon = iconMap[stat.label] || Briefcase
          return (
            <Card key={stat.label} className="border-none shadow-sm bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-2xl">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Weekly application trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.applicationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" fontSize={12} />
                  <YAxis fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0891b2"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="accepted"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Applications by Role</CardTitle>
            <CardDescription>Top 5 roles attracting applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {dashboardData.rolePerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.rolePerformance} margin={{ bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="role"
                      fontSize={11}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis fontSize={12} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Legend />
                    <Bar dataKey="applications" fill="#0891b2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                  No role performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

