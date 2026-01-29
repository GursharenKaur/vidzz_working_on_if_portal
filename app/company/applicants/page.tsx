"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, User, Mail, Phone, BookOpen, GraduationCap, Github, Linkedin, FileText, ExternalLink, ChevronLeft, Download, Maximize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const statusConfig: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-950 text-amber-600",
  shortlisted: "bg-green-50 dark:bg-green-950 text-green-600",
  rejected: "bg-red-50 dark:bg-red-950 text-red-600",
  accepted: "bg-blue-50 dark:bg-blue-950 text-blue-600",
  applied: "bg-gray-50 dark:bg-gray-950 text-gray-600",
}

export default function ApplicantsPage() {
  const { token, _hasHydrated } = useAuthStore()
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")



  useEffect(() => {
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applicants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Map backend data to frontend structure
          const mapped = data.data.map((app: any) => ({
            id: app._id,
            name: app.studentId?.userId?.name || "Unknown",
            email: app.studentId?.userId?.email || "Unknown",
            position: app.roleId?.title || "Unknown Role",
            status: app.status || "PENDING",
            appliedDate: new Date(app.createdAt).toLocaleDateString(),
            university: app.studentId?.university || app.studentId?.branch || "N/A",
            resumeUrl: app.resumeUrl,
            studentData: app.studentId // Store the full student profile for the modal
          }))
          setApplicants(mapped)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/applicant/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus.toUpperCase() } : a))
      }
    } catch (error) {
      console.error("Failed to update status", error)
    }
  }

  const filtered = applicants.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Review and manage student applicants</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or position..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applicants List</CardTitle>
          <CardDescription>{filtered.length} applicants matching filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <p className="text-sm text-muted-foreground">{applicant.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{applicant.position}</TableCell>
                    <TableCell className="text-sm">{applicant.university}</TableCell>
                    <TableCell className="text-sm">{applicant.appliedDate}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[applicant.status.toLowerCase()] || "bg-gray-100"} variant="secondary">
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {/* Status Actions */}
                      {applicant.status.toUpperCase() !== 'ACCEPTED' && applicant.status.toUpperCase() !== 'REJECTED' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(applicant.id, 'shortlisted')}>
                            Shortlist
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleStatusUpdate(applicant.id, 'rejected')}>
                            Reject
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-500 hover:text-green-700" onClick={() => handleStatusUpdate(applicant.id, 'accepted')}>
                            Accept
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => {
                          setSelectedApplicant(applicant)
                          setIsProfileOpen(true)
                          setActiveTab("profile")
                        }}
                      >
                        View Profile
                      </Button>

                      {applicant.resumeUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setSelectedApplicant(applicant)
                            setIsProfileOpen(true)
                            setActiveTab("resume")
                          }}
                        >
                          Resume
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <DialogHeader className="p-0 shrink-0">
              <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-6 text-white relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
                  <div className="flex items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-inner">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-3xl font-extrabold tracking-tight">{selectedApplicant?.name}</DialogTitle>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-indigo-100 text-sm mt-2">
                        <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                          <Mail className="h-3.5 w-3.5" />
                          {selectedApplicant?.email}
                        </span>
                        {selectedApplicant?.studentData?.phone && (
                          <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                            <Phone className="h-3.5 w-3.5" />
                            {selectedApplicant.studentData.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <TabsList className="bg-white/10 border border-white/20 h-11 p-1">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 px-6 font-bold transition-all">
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="resume" className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 px-6 font-bold transition-all">
                      Resume
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-hidden bg-slate-50/50">
              <TabsContent value="profile" className="h-[calc(95vh-200px)] m-0">
                <ScrollArea className="h-full">
                  <div className="p-8 space-y-8 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left: Academic Status Card */}
                      <div className="md:col-span-1 space-y-6">
                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-indigo-600" />
                            Education
                          </h3>
                          <div className="space-y-6">
                            <div className="space-y-1">
                              <p className="text-xs text-slate-400 font-bold uppercase">Department</p>
                              <p className="text-slate-700 font-bold text-lg">{selectedApplicant?.studentData?.branch || "N/A"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs text-slate-400 font-bold uppercase">CGPA</p>
                                <p className="text-indigo-600 font-black text-2xl">{selectedApplicant?.studentData?.cgpa || "N/A"}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-slate-400 font-bold uppercase">Year</p>
                                <p className="text-slate-700 font-bold text-lg">{selectedApplicant?.studentData?.year || "N/A"}</p>
                              </div>
                            </div>
                            <div className="space-y-1 pt-2">
                              <p className="text-xs text-slate-400 font-bold uppercase">Roll Number</p>
                              <p className="text-slate-600 font-mono text-sm">{selectedApplicant?.studentData?.rollNo || "N/A"}</p>
                            </div>
                          </div>
                        </section>

                        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60">
                          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Connect</h3>
                          <div className="flex gap-3">
                            {selectedApplicant?.studentData?.github && (
                              <a href={selectedApplicant.studentData.github} target="_blank" rel="noopener noreferrer" className="flex-1 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors group">
                                <Github className="h-5 w-5 text-slate-600 group-hover:text-black" />
                              </a>
                            )}
                            {selectedApplicant?.studentData?.linkedin && (
                              <a href={selectedApplicant.studentData.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors group">
                                <Linkedin className="h-5 w-5 text-blue-500 group-hover:text-blue-700" />
                              </a>
                            )}
                          </div>
                        </section>
                      </div>

                      {/* Right: Bio and Skills */}
                      <div className="md:col-span-2 space-y-8">
                        <section className="space-y-4">
                          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
                            Professional Summary
                          </h3>
                          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                            <p className="text-slate-600 leading-relaxed text-lg italic">
                              "{selectedApplicant?.studentData?.bio || "No summary provided by the student."}"
                            </p>
                          </div>
                        </section>

                        <section className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                              <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
                              Technical Expertise
                            </h3>
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                              {selectedApplicant?.studentData?.skills?.length || 0} Skills
                            </Badge>
                          </div>
                          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
                            <div className="flex flex-wrap gap-2.5">
                              {selectedApplicant?.studentData?.skills && selectedApplicant.studentData.skills.length > 0 ? (
                                selectedApplicant.studentData.skills.map((skill: string, i: number) => (
                                  <span key={i} className="px-4 py-2 bg-indigo-50/50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100/50 hover:bg-indigo-100 transition-colors">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <p className="text-slate-400 italic py-4">Student has not listed any specific technical skills yet.</p>
                              )}
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="resume" className="h-[calc(95vh-200px)] m-0 bg-slate-200 relative">
                {selectedApplicant?.resumeUrl ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <Button size="sm" className="bg-white/90 hover:bg-white text-indigo-700 shadow-xl backdrop-blur-md rounded-xl font-bold" onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedApplicant.resumeUrl}`, '_blank')}>
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Open New Tab
                      </Button>
                    </div>
                    <iframe
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedApplicant.resumeUrl}#toolbar=0`}
                      className="w-full h-full border-none"
                      title="Resume Viewer"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 bg-white">
                    <FileText className="h-16 w-16 opacity-20" />
                    <p className="font-medium">No resume uploaded by this student.</p>
                  </div>
                )}
              </TabsContent>
            </div>

            <div className="shrink-0 p-4 bg-white border-t flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`${statusConfig[selectedApplicant?.status?.toLowerCase()] || "bg-slate-100"} px-4 py-1.5 rounded-xl border-none font-bold uppercase tracking-wider text-[10px]`}>
                  Status: {selectedApplicant?.status}
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="h-11 px-6 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="h-11 px-8 font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-50"
                  onClick={() => {
                    handleStatusUpdate(selectedApplicant.id, 'accepted')
                    setIsProfileOpen(false)
                    toast.success("Student accepted!")
                  }}
                  disabled={selectedApplicant?.status === 'ACCEPTED'}
                >
                  Accept Applicant
                </Button>
                <Button
                  variant="outline"
                  className="h-11 px-8 font-bold text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all disabled:opacity-50"
                  onClick={() => {
                    handleStatusUpdate(selectedApplicant.id, 'rejected')
                    setIsProfileOpen(false)
                    toast.error("Application rejected.")
                  }}
                  disabled={selectedApplicant?.status === 'REJECTED'}
                >
                  Reject
                </Button>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
