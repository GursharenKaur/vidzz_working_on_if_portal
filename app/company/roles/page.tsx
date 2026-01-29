"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Loader2, Briefcase, IndianRupee, DollarSign, Users } from "lucide-react"
import { companyApi } from "@/lib/api/company"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
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
      setIsLoading(false)
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
        toast.success("Internship role updated successfully!")
      } else {
        await companyApi.createRole(formData)
        toast.success("Internship role created successfully!")
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
    if (!confirm("Are you sure you want to delete this role?")) return
    try {
      await companyApi.deleteRole(id)
      toast.success("Role deleted")
      fetchRoles()
    } catch (error) {
      toast.error("Failed to delete role")
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Internship Roles
          </h1>
          <p className="text-muted-foreground mt-1">Manage your active internship positions and applicants</p>
        </div><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="shadow-md hover:shadow-lg transition-all"
              onClick={() => {
                setEditingRole(null)
                setFormData({ title: "", description: "", stipend: "", eligibility: "", currency: "INR" })
                setIsDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Role
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-0 overflow-hidden text-black">
            {/* HEADER */}
            <div className="bg-black p-6 border-b">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {editingRole ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
                  </div>
                  {editingRole ? "Edit Role" : "Create New Role"}
                </DialogTitle>

                <DialogDescription className="text-white/90">
                  {editingRole ? "Update the details of your internship position." : "Fill in the details below to post a new internship position."}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white text-black">
              <div className="grid gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-semibold uppercase tracking-wider text-black"
                  >
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend Developer Intern"
                    className="h-11 bg-white text-black placeholder:text-gray-500 focus:bg-white"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold uppercase tracking-wider text-black"
                  >
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What will the intern work on? List key responsibilities..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-white text-black placeholder:text-gray-500 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>

                {/* Stipend & Eligibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="stipend"
                      className="text-sm font-semibold uppercase tracking-wider text-black flex items-center gap-1.5"
                    >
                      {formData.currency === 'USD' ? <DollarSign className="h-3.5 w-3.5" /> : <IndianRupee className="h-3.5 w-3.5" />}
                      Stipend ({formData.currency})
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="stipend"
                        name="stipend"
                        value={formData.stipend}
                        onChange={handleInputChange}
                        placeholder={formData.currency === 'USD' ? "e.g., 500 / month" : "e.g., 10,000 / month"}
                        className="h-11 bg-white text-black placeholder:text-gray-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-20 bg-gray-50 text-black border-input hover:bg-gray-100"
                        onClick={() => setFormData(prev => ({ ...prev, currency: prev.currency === 'INR' ? 'USD' : 'INR' }))}
                      >
                        {formData.currency}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="eligibility"
                      className="text-sm font-semibold uppercase tracking-wider text-black flex items-center gap-1.5"
                    >
                      <Users className="h-3.5 w-3.5" />
                      Eligibility
                    </Label>
                    <Input
                      id="eligibility"
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleInputChange}
                      placeholder="e.g., 3rd/4th year B.Tech"
                      className="h-11 bg-white text-black placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-black hover:bg-gray-100 px-6"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white hover:bg-black/90 px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingRole ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingRole ? "Update Position" : "Create Position"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
          <p className="text-muted-foreground font-medium">Fetching active roles...</p>
        </div>
      ) : roles.length === 0 ? (
        <div className="relative py-20 px-6 rounded-2xl border-2 border-dashed border-primary/10 bg-primary/[0.02] overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-5 rounded-2xl mb-6 shadow-sm ring-1 ring-primary/20">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">No active roles found</h3>
            <p className="text-muted-foreground max-w-sm mt-3 text-lg leading-relaxed">
              Ready to expand your team? Post your first internship role and start reaching top talent today.
            </p>
            <Button
              size="lg"
              className="mt-8 shadow-lg hover:shadow-xl transition-all h-12 px-8"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Post First Internship
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role._id} className="hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <Badge variant="secondary" className="font-medium capitalize">
                        {role.status || 'active'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        {role.currency === 'USD' ? <DollarSign className="h-4 w-4" /> : <IndianRupee className="h-4 w-4" />}
                        <span className="font-medium text-foreground">{role.stipend}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                        <Users className="h-4 w-4" />
                        <span className="font-medium text-foreground">{role.eligibility}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(role._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      View Applicants
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
