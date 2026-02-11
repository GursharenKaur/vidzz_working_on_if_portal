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
import { Sparkles, BarChart3, TrendingUp, GraduationCap, MapPin, Activity, ArrowUpRight } from "lucide-react"

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

export default function FacultyAnalyticsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Data Intelligence</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Analytical Insights</h1>
          <p className="text-zinc-500 font-medium">Deep-dive metrics and cross-sectional performance evaluation.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-zinc-400">
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Deep Engine Live</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                University Distribution
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Application volume mapped across academic institutions.</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universityApplications}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="university"
                  stroke="#52525b"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#71717a' }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#71717a' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="applications" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Total Influx" />
                <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                Role Market Share
              </h3>
              <p className="text-xs text-zinc-500 font-medium">Competitive analysis of internship positions.</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rolePopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#52525b"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#71717a' }}
                />
                <YAxis
                  type="category"
                  dataKey="role"
                  stroke="#52525b"
                  fontSize={8}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#71717a' }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: '#09090b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                <Bar dataKey="applications" fill="#a78bfa" radius={[0, 4, 4, 0]} name="Application Volume" />
                <Bar dataKey="accepted" fill="#10b981" radius={[0, 4, 4, 0]} name="Acceptance Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              Conversion Pipeline Velocity
            </h3>
            <p className="text-sm text-zinc-500 font-medium">Temporal analysis of application success and rejection trajectories.</p>
          </div>
          <Activity className="h-8 w-8 text-zinc-800" />
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#52525b"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#71717a' }}
              />
              <YAxis
                stroke="#52525b"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#71717a' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              <Line type="monotone" dataKey="total" stroke="#a78bfa" strokeWidth={4} name="Global Volume" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={4} name="Success Stream" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={4} name="Negative Stream" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}

