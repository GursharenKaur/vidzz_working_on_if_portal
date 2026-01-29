"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  IndianRupee,
  FileText,
  Upload,
  Globe,
  CheckCircle,
  Loader2,
  ChevronRight,
  Info
} from "lucide-react"
import { toast } from "sonner"
import { studentApi } from "@/lib/api/student"

export default function CompanyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  const { token } = useAuthStore()

  const [company, setCompany] = useState<any>(null)
  const [roles, setRoles] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [useExistingResume, setUseExistingResume] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingResume, setExistingResume] = useState<{ name: string; url: string } | null>(null)
  const [appliedRoleIds, setAppliedRoleIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const loadData = async () => {
      try {
        setLoading(true)
        // Fetch company and roles
        const compRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/company/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const compJson = await compRes.json()

        const companyData = compJson?.data?.company || compJson?.company || null
        const rolesData = compJson?.data?.roles || compJson?.roles || []

        setCompany(companyData)
        setRoles(rolesData)
        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0])
        }

        // Fetch student profile for resume
        const profData = await studentApi.getProfile()
        const s = profData?.student || profData
        const r = s?.resumeUrl
        if (r) {
          setExistingResume({
            name: r.split("/").pop() || "resume.pdf",
            url: r.startsWith('http') ? r : `${process.env.NEXT_PUBLIC_BACKEND_URL}${r}`,
          })
        }

        // Fetch existing applications to check what's already applied
        const appsData = await studentApi.getApplications()
        if (appsData) {
          const ids = appsData.map((app: any) => app.roleId?._id || app.roleId)
          setAppliedRoleIds(ids)
        }
      } catch (err) {
        toast.error("Failed to load company details")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, companyId])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !token) return

    try {
      setIsSubmitting(true)

      const res = await studentApi.applyForRole(selectedRole._id, useExistingResume, resume || undefined)

      if (res.success) {
        toast.success("Application submitted successfully! ✅")
        setAppliedRoleIds(prev => [...prev, selectedRole._id])
        setTimeout(() => {
          router.push('/student/applications')
        }, 1500)
      } else {
        toast.error(res.message || "Failed to submit application")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-muted-foreground animate-pulse">Loading company overview...</p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="p-8 text-center bg-muted/20 rounded-2xl border m-8">
        <h2 className="text-2xl font-bold">Company not found</h2>
        <Button variant="link" onClick={() => router.back()}>Go back</Button>
      </div>
    )
  }

  const logoUrl = company.logo
    ? (company.logo.startsWith('http') ? company.logo : `${process.env.NEXT_PUBLIC_BACKEND_URL}${company.logo}`)
    : "https://via.placeholder.com/150?text=Company"

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-2xl border shadow-sm bg-white p-3 flex items-center justify-center shrink-0">
            <img
              src={logoUrl}
              alt={company.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=Logo")}
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full text-sm">
                <MapPin className="h-4 w-4" />
                {company.location || company.address?.city || "Remote"}
              </span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors bg-muted/50 px-3 py-1 rounded-full text-sm"
                >
                  <Globe className="h-4 w-4" />
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Details & Roles */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" />
              About the Company
            </h2>
            <Card className="border-none shadow-sm bg-muted/10">
              <CardContent className="pt-6 text-lg leading-relaxed text-muted-foreground">
                {company.about || company.description || "No description available for this company."}
              </CardContent>
            </Card>
          </section>

          {/* Roles Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Open Opportunities
              </h2>
              <Badge variant="secondary">{roles.length} Roles</Badge>
            </div>

            <div className="grid gap-4">
              {roles.length === 0 ? (
                <div className="p-12 border-2 border-dashed rounded-2xl text-center">
                  <p className="text-muted-foreground">This company hasn't posted any roles yet.</p>
                </div>
              ) : (
                roles.map((role) => (
                  <Card
                    key={role._id}
                    className={`group cursor-pointer transition-all border-2 ${selectedRole?._id === role._id
                      ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.02]'
                      : 'hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {role.title}
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                              {role.currency === 'USD' ? <DollarSign className="h-3.5 w-3.5" /> : <IndianRupee className="h-3.5 w-3.5" />}
                              {role.stipend}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {role.eligibility}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {role.description}
                          </p>
                        </div>
                        <Button
                          variant={appliedRoleIds.includes(role._id) ? "outline" : selectedRole?._id === role._id ? "default" : "outline"}
                          className={`shrink-0 ${appliedRoleIds.includes(role._id) ? 'text-amber-600 border-amber-200 bg-amber-50/50' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRole(role)
                            document.getElementById('application-card')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                        >
                          {appliedRoleIds.includes(role._id) ? "Applied" : selectedRole?._id === role._id ? "Selected" : "Select Role"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Application Form */}
        <div className="lg:sticky lg:top-8" id="application-card">
          <Card className="shadow-xl border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Apply Now</CardTitle>
              <CardDescription>
                Submit your application for <span className="text-foreground font-semibold">{selectedRole?.title}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex p-1 bg-muted rounded-xl gap-1">
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${useExistingResume
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                      onClick={() => setUseExistingResume(true)}
                    >
                      Existing Resume
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${!useExistingResume
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                      onClick={() => setUseExistingResume(false)}
                    >
                      Upload New
                    </button>
                  </div>

                  {useExistingResume ? (
                    <div className="border rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                      {existingResume ? (
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{existingResume.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
                              Ready to submit
                            </p>
                          </div>
                          <a
                            href={existingResume.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-primary hover:underline hover:text-primary/80"
                          >
                            VIEW
                          </a>
                        </div>
                      ) : (
                        <div className="text-center py-4 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            No resume found in your profile.
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => setUseExistingResume(false)}
                          >
                            Upload a new one
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative group">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          accept=".pdf"
                          onChange={(e) => setResume(e.target.files?.[0] || null)}
                        />
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors group-hover:border-primary/50 group-hover:bg-primary/[0.02]">
                          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary mb-2" />
                          <p className="text-sm font-medium text-center">
                            {resume ? (
                              <span className="text-primary">{resume.name}</span>
                            ) : (
                              "Click or drag PDF here"
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">PDF only, max 5MB</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                    disabled={(useExistingResume && !existingResume) || (!useExistingResume && !resume) || isSubmitting || !selectedRole || appliedRoleIds.includes(selectedRole?._id)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : appliedRoleIds.includes(selectedRole?._id) ? (
                      <>
                        <Clock className="mr-2 h-5 w-5" />
                        Applied
                      </>
                    ) : (
                      <>
                        Apply for this Role
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {selectedRole && (
                <div className="mt-8 pt-6 border-t animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Role Summary</h4>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">{selectedRole.description}</p>
                    <div>
                      <h5 className="font-bold text-sm mb-2">Requirements:</h5>
                      <p className="text-sm text-muted-foreground">{selectedRole.eligibility}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

