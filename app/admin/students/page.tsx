"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Sparkles, Users, UserCheck, ShieldCheck, Mail, GraduationCap, MapPin, Calendar, ArrowUpRight, Upload, Trash2, FileSpreadsheet, X, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    university: "MIT",
    major: "Computer Science",
    applications: 5,
    joinDate: "2024-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    university: "Stanford",
    major: "Software Engineering",
    applications: 3,
    joinDate: "2024-01-05",
  },
  {
    id: 3,
    name: "Mark Johnson",
    email: "mark@example.com",
    university: "UC Berkeley",
    major: "Data Science",
    applications: 4,
    joinDate: "2024-01-10",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    university: "Caltech",
    major: "Computer Science",
    applications: 2,
    joinDate: "2024-01-15",
  },
]

export default function StudentsPage() {
  const [search, setSearch] = useState("")

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.university.toLowerCase().includes(search.toLowerCase()),
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
            <Users className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">User Management</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Students</h1>
          <p className="text-muted-foreground font-medium">Manage and monitor student activity across the platform.</p>
        </div>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <FileSpreadsheet className="h-4 w-4" />
                Import Students
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border rounded-[32px] p-0 overflow-hidden max-w-md shadow-2xl">
              <div className="p-8 lg:p-10 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent border-b border-border">
                <DialogHeader className="space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-foreground/5 border border-border flex items-center justify-center shadow-inner text-cyan-500">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">Import Cohort</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium mt-1">Upload student records via CSV automation.</DialogDescription>
                  </div>
                </DialogHeader>
              </div>
              <div className="p-8 lg:p-10 space-y-8">
                <div className="group relative border-2 border-dashed border-border hover:border-cyan-500/50 rounded-[32px] p-12 text-center transition-all bg-foreground/[0.02] hover:bg-cyan-500/[0.02] cursor-pointer">
                  <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="csv-upload-admin" />
                  <div className="space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                      <FileSpreadsheet className="h-6 w-6 text-muted-foreground group-hover:text-cyan-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-foreground tracking-tight">Select Data Source</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full inline-block mt-2">CSV FORMAT ONLY</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full h-16 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-foreground/10 transition-all active:scale-95">
                  Execute Import
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search students..."
              className="h-14 pl-12 bg-foreground/5 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:ring-cyan-500/50 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-6 bg-foreground/5 border border-border rounded-2xl">
            <Users className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-black text-foreground uppercase tracking-widest">{filtered.length} Students</span>
          </div>
        </div>

        <GlassCard className="overflow-hidden border-border bg-card/50">
          <Table>
            <TableHeader className="bg-foreground/[0.02]">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-8">Name</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">University</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Major</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Status</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-8 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filtered.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-border group hover:bg-foreground/[0.03] transition-colors"
                  >
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                          <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground group-hover:text-cyan-500 transition-colors uppercase tracking-tight">{student.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="h-3 w-3 text-muted-foreground/30" />
                            <p className="text-[10px] font-bold text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="text-xs font-bold text-muted-foreground">{student.university}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="text-xs font-bold text-muted-foreground">{student.major}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-foreground/5 border border-border text-[10px] font-black text-foreground">
                        {student.applications} APPS
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
              <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">No matching students found</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

