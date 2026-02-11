"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Sparkles, Building2, ShieldCheck, Mail, MapPin, Briefcase, Users, ArrowUpRight, Ban, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"

const companies = [
  {
    id: 1,
    name: "TechCorp",
    email: "hr@techcorp.com",
    location: "San Francisco, CA",
    roles: 5,
    applications: 48,
    joinDate: "2024-01-01",
    status: "active",
  },
  {
    id: 2,
    name: "InnovateLabs",
    email: "hr@innovatelabs.com",
    location: "New York, NY",
    roles: 3,
    applications: 32,
    joinDate: "2024-01-05",
    status: "active",
  },
  {
    id: 3,
    name: "DesignStudio",
    email: "hr@designstudio.com",
    location: "Los Angeles, CA",
    roles: 2,
    applications: 18,
    joinDate: "2024-01-10",
    status: "active",
  },
  {
    id: 4,
    name: "DataFlow",
    email: "hr@dataflow.com",
    location: "Seattle, WA",
    roles: 4,
    applications: 28,
    joinDate: "2024-01-15",
    status: "suspended",
  },
]

export default function FacultyCompaniesPage() {
  const [search, setSearch] = useState("")

  const filtered = companies.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  )

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
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Corporate Relations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Enterprise Hub</h1>
          <p className="text-zinc-500 font-medium">Coordinate and audit corporate partnerships and internship deployment.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-zinc-400`}>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Platform Verified</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Search by company name or domain..."
              className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-zinc-700 focus:ring-purple-500/50 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-6 bg-white/5 border border-white/10 rounded-2xl">
            <Building2 className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-black text-white uppercase tracking-widest">{filtered.length} Partners</span>
          </div>
        </div>

        <GlassCard className="overflow-hidden border-white/5">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 pl-8">Corporate Entity</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Location</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Inventory</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Engagement</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 pr-8 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filtered.map((company, idx) => (
                  <motion.tr
                    key={company.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-white/5 group hover:bg-white/[0.03] transition-colors"
                  >
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{company.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="h-3 w-3 text-zinc-600" />
                            <p className="text-[10px] font-bold text-zinc-500">{company.email}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-300">{company.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-300">{company.roles} Active</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-300">{company.applications} Enrolled</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${company.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {company.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{company.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/10"
                      >
                        Inspect <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 rounded-full bg-white/5">
                <Search className="h-8 w-8 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">No matching partners found in corporate hub</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

