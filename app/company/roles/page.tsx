"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Loader2, Briefcase, IndianRupee, DollarSign, Users, Sparkles, X, CheckCircle2, Search, ArrowUpRight } from "lucide-react"
import { companyApi } from "@/lib/api/company"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stipend: "",
    eligibility: "",
    currency: "INR"
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      const data = await companyApi.getRoles()
      setRoles(data)
    } catch (error) {
      toast.error("Failed to fetch roles")
    } finally {
      setTimeout(() => setIsLoading(false), 800)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      if (editingRole) {
        await companyApi.updateRole(editingRole._id, formData)
        toast.success("Role updated successfully!")
      } else {
        await companyApi.createRole(formData)
        toast.success("New role published!")
      }
      setFormData({ title: "", description: "", stipend: "", eligibility: "", currency: "INR" })
      setEditingRole(null)
      setIsDialogOpen(false)
      fetchRoles()
    } catch (error) {
      toast.error(editingRole ? "Failed to update role" : "Failed to create role")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setFormData({
      title: role.title,
      description: role.description,
      stipend: role.stipend,
      eligibility: role.eligibility,
      currency: role.currency || "INR",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this position?")) return
    try {
      await companyApi.deleteRole(id)
      toast.success("Role deactivated")
      fetchRoles()
    } catch (error) {
      toast.error("Failed to delete role")
    }
  }

  const filteredRoles = roles.filter(role =>
    role.title.toLowerCase().includes(search.toLowerCase()) ||
    role.description.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 bg-white/5" />
            <Skeleton className="h-4 w-96 bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full bg-white/5 rounded-[32px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-500">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Postings</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">Job Openings</h1>
          <p className="text-muted-foreground font-medium">Create and manage your available internship positions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search jobs..."
              className="h-12 pl-12 bg-foreground/5 border-border rounded-2xl text-foreground focus:ring-cyan-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={() => {
              setEditingRole(null)
              setFormData({ title: "", description: "", stipend: "", eligibility: "", currency: "INR" })
              setIsDialogOpen(true)
            }}
            className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-foreground/10"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={3} />
            Post New Role 
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRoles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-40 flex flex-col items-center justify-center text-center gap-6 bg-foreground/[0.02] rounded-[40px] border border-dashed border-border"
            >
              <div className="p-8 rounded-full bg-foreground/5">
                <Briefcase className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <p className="font-bold uppercase tracking-widest text-muted-foreground text-xs">No active jobs found</p>
                <Button variant="link" onClick={() => setSearch("")} className="text-cyan-500 font-bold uppercase tracking-widest text-[10px]">Clear Search</Button>
              </div>
            </motion.div>
          ) : (
            filteredRoles.map((role, idx) => (
              <motion.div
                key={role._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                layout
              >
                <GlassCard className="group p-8 space-y-6 relative overflow-hidden flex flex-col h-full hover:bg-foreground/[0.04] border-border bg-card/50">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-foreground/5 rounded-2xl border border-border group-hover:border-cyan-500/30 transition-colors text-muted-foreground group-hover:text-cyan-500">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow">
                    <h3 className="text-2xl font-black text-foreground group-hover:text-cyan-500 transition-colors line-clamp-1">{role.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <IndianRupee className="h-3 w-3 text-cyan-500" />
                        {role.stipend}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Users className="h-3 w-3 text-cyan-500" />
                        {role.eligibility}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(role)}
                          className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(role._id)}
                          className="h-10 w-10 p-0 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        className="bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl px-5 font-bold text-[10px] uppercase tracking-widest h-10 border border-border"
                      >
                        Applicants <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-neutral-900 border border-border shadow-2xl p-0 overflow-hidden rounded-3xl">
          <div className="p-10 lg:p-14 bg-white dark:bg-neutral-900 border-b border-border">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-5">
                <div className="p-5 bg-foreground/5 rounded-3xl border border-border text-cyan-500 shadow-inner">
                  {editingRole ? <Edit className="h-10 w-10" /> : <Plus className="h-10 w-10" strokeWidth={3} />}
                </div>
                <div>
                  <DialogTitle className="text-3xl lg:text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
                    {editingRole ? "Update Position" : "Create Opening"}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-medium mt-1">
                    Complete the details to announce a new role.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Job Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineer Intern"
                  className="h-14 bg-foreground/5 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/30 focus:ring-cyan-500/50 px-6 font-bold text-lg"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role and responsibilities..."
                  className="flex min-h-[160px] w-full rounded-3xl border border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground/30 px-6 py-4 text-sm focus:ring-cyan-500/50 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="stipend" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <IndianRupee className="h-3 w-3" />
                    Stipend
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="stipend"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      placeholder="e.g. 15,000 / month"
                      className="h-14 bg-foreground/5 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/30 focus:ring-cyan-500/50 px-6 font-bold"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 w-20 bg-foreground/5 text-muted-foreground border-border hover:bg-foreground/10 hover:text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setFormData(prev => ({ ...prev, currency: prev.currency === 'INR' ? 'USD' : 'INR' }))}
                    >
                      {formData.currency}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="eligibility" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Eligibility
                  </Label>
                  <Input
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    placeholder="e.g. 3rd Year Students"
                    className="h-14 bg-foreground/5 border-border rounded-2xl text-foreground placeholder:text-muted-foreground/30 focus:ring-cyan-500/50 px-6 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 shrink-0 px-8 lg:px-12 pb-10">
              <Button
                type="button"
                variant="ghost"
                className="h-14 px-8 text-muted-foreground hover:text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {editingRole ? "Confirm Changes" : "Push Live"}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

