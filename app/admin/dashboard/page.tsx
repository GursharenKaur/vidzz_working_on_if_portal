"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, TrendingUp, Activity, Sparkles, PieChart as PieIcon, BarChart3, ArrowUpRight, ShieldAlert } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { StatCard } from "@/components/shared/stat-card"

const stats = [
  { icon: Users, label: "Global Users", value: 2847, color: "text-blue-400" },
  { icon: Building2, label: "Corporate Partners", value: 156, color: "text-cyan-400" },
  { icon: TrendingUp, label: "System Throughput", value: 8934, color: "text-indigo-400" },
  { icon: Activity, label: "Live Deployments", value: 342, color: "text-sky-400" },
]

const overallTrends = [
  { month: "Jan", students: 500, companies: 50, applications: 1200 },
  { month: "Feb", students: 680, companies: 65, applications: 1800 },
  { month: "Mar", students: 920, companies: 85, applications: 2400 },
  { month: "Apr", students: 1200, companies: 110, applications: 3500 },
  { month: "May", students: 1650, companies: 135, applications: 5200 },
  { month: "Jun", students: 2847, companies: 156, applications: 8934 },
]

const platformStats = [
  { name: "Successful Placements", value: 234, color: "#22d3ee" }, // cyan-400
  { name: "Pending Applications", value: 1245, color: "#3b82f6" }, // blue-500
  { name: "Rejected Applications", value: 456, color: "#6366f1" }, // indigo-500
]

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Platform Overview</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground font-medium">Monitor platform performance and engagement metrics.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-foreground/5 border border-border flex items-center gap-2 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Operational Integrity: 100%</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 space-y-8" delay={0.2}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
                Platform Growth
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Growth of students and company partners.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground/30" />
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overallTrends}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="month"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
                <Area
                  type="monotone"
                  dataKey="companies"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCompanies)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 space-y-8" delay={0.3}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-indigo-500" />
                Application Status
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Distribution of applications across the platform.</p>
            </div>
          </div>

          <div className="h-[350px] w-full flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full md:w-48">
              {platformStats.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-10 space-y-10 overflow-hidden relative" delay={0.4}>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <BarChart3 className="h-64 w-64 text-cyan-500" />
        </div>
        <div className="space-y-1 relative z-10">
          <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyan-500" />
            Application Trends
          </h3>
          <p className="text-sm text-muted-foreground font-medium">Tracking platform application volume over time.</p>
        </div>

        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overallTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
              <XAxis
                dataKey="month"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#06b6d4"
                strokeWidth={4}
                dot={{ r: 6, fill: '#06b6d4', strokeWidth: 0 }}
                activeDot={{ r: 8, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}

