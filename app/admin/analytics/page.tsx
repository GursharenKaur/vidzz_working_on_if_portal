"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Sparkles, BarChart3, TrendingUp, GraduationCap, MapPin, Activity, Globe, ShieldCheck } from "lucide-react"

const universityApplications = [
  { university: "MIT", applications: 234, accepted: 45 },
  { university: "Stanford", applications: 189, accepted: 38 },
  { university: "UC Berkeley", applications: 167, accepted: 32 },
  { university: "Caltech", applications: 145, accepted: 28 },
  { university: "CMU", applications: 126, accepted: 24 },
]

const applicationConversion = [
  { week: "Week 1", total: 400, accepted: 45, rejected: 85 },
  { week: "Week 2", total: 580, accepted: 92, rejected: 118 },
  { week: "Week 3", total: 720, accepted: 156, rejected: 180 },
  { week: "Week 4", total: 890, accepted: 234, rejected: 256 },
]

const rolePopularity = [
  { role: "Frontend Dev", applications: 234, accepted: 45 },
  { role: "Backend Dev", applications: 201, accepted: 38 },
  { role: "Data Analyst", applications: 167, accepted: 28 },
  { role: "Product Manager", applications: 145, accepted: 24 },
  { role: "QA Engineer", applications: 87, accepted: 15 },
]

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <BarChart3 className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Insights</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Analytics</h1>
          <p className="text-muted-foreground font-medium">Monitor platform performance and engagement metrics.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-2xl bg-foreground/5 border border-border flex items-center gap-2 text-muted-foreground`}>
            <ShieldCheck className="h-4 w-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Live Data</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 space-y-8 border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-cyan-500" />
                University Reach
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Distribution of applications and focus across institutions.</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universityApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
                <XAxis
                  dataKey="university"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="applications" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Applications" />
                <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 space-y-8 border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-500" />
                Popular Roles
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Trends in job role requests and placements.</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rolePopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="role"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fontSize={8}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="applications" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Applications" />
                <Bar dataKey="accepted" fill="#10b981" radius={[0, 4, 4, 0]} name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-10 space-y-10 border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-cyan-500" />
              Application Trends
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Weekly analysis of total, accepted, and rejected applications.</p>
          </div>
          <Activity className="h-8 w-8 text-muted-foreground/20" />
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'var(--foreground)'
                }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={4} name="Total Applications" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={4} name="Accepted" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={4} name="Rejected" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}

