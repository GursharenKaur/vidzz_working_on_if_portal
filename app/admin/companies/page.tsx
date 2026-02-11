"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Sparkles, Building2, ShieldCheck, Mail, MapPin, Briefcase, Users, ArrowUpRight, Ban, CheckCircle2, Trash2, Globe } from "lucide-react"
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

export default function CompaniesPage() {
  const [search, setSearch] = useState("")

  const filtered = companies.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <Building2 className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Partners</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Companies</h1>
          <p className="text-muted-foreground font-medium">Manage all registered companies and their internship activities.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-2xl bg-foreground/5 border border-border flex items-center gap-2 text-muted-foreground`}>
            <ShieldCheck className="h-4 w-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Verified System</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search companies..."
              className="h-14 pl-12 bg-foreground/5 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:ring-cyan-500/50 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-6 bg-foreground/5 border border-border rounded-2xl">
            <Building2 className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-black text-foreground uppercase tracking-widest">{filtered.length} Companies</span>
          </div>
        </div>

        <GlassCard className="overflow-hidden border-border bg-card/50">
          <Table>
            <TableHeader className="bg-foreground/[0.02]">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-8">Company</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verification</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-8 text-right">Actions</TableHead>
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
                    className="border-border group hover:bg-foreground/[0.03] transition-colors"
                  >
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground group-hover:text-cyan-500 transition-colors uppercase tracking-tight">{company.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="h-3 w-3 text-muted-foreground/30" />
                            <p className="text-[10px] font-bold text-muted-foreground">{company.email}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="text-xs font-bold text-muted-foreground">{company.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center gap-3 px-3 py-1 rounded-lg bg-foreground/5 border border-border">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-foreground leading-none">{company.roles}</span>
                          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Roles</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-foreground leading-none">{company.applications}</span>
                          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Apps</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${company.status === 'active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                        {company.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{company.status === 'active' ? 'Verified' : 'Suspended'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl border border-border"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 bg-foreground/5 hover:bg-rose-500/20 text-rose-500 rounded-xl border border-border hover:border-rose-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 rounded-full bg-foreground/5">
                <Search className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No matching companies found</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

