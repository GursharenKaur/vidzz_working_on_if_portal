"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { File as FileIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { studentApi } from "@/lib/api/student"

export default function StudentProfilePage() {
  const { user, token } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [resume, setResume] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    rollNo: "",
    branch: "",
    year: "",
    cgpa: "",
    phone: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: ""
  })

  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchProfile = async () => {
      try {
        const data = await studentApi.getProfile()
        if (data && (data.student || data)) {
          const s = data.student || data
          setFormData({
            name: user?.name ?? "",
            rollNo: s.rollNo || "",
            branch: s.branch || "",
            year: s.year || "",
            cgpa: s.cgpa?.toString() || "",
            phone: s.phone || "",
            bio: s.bio || "",
            github: s.github || "",
            linkedin: s.linkedin || "",
            skills: s.skills?.join(", ") || ""
          })
          if (s.resumeUrl) {
            setUploadedResumeUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${s.resumeUrl}`)
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [token, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!token) return
    setIsSaving(true)
    try {
      await studentApi.updateProfile(formData)
      toast.success("Profile updated successfully ✅")
    } catch (err) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    try {
      setIsUploading(true)
      const data = await studentApi.uploadResume(file)
      if (data.success) {
        setUploadedResumeUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.resume}`)
        toast.success("Resume uploaded successfully! 📁")
      }
    } catch (err) {
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your academic and professional details</p>
        </div>
        <Button
          size="lg"
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 shadow-lg shadow-primary/20"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Academic Info */}
          <Card className="border-none shadow-sm shadow-black/5">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-xl">Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>University Email</Label>
                <Input value={user?.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input name="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="e.g. 21BCS001" />
              </div>
              <div className="space-y-2">
                <Label>Branch / Course</Label>
                <Input name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g. Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>Year of Study</Label>
                <Input name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 3rd Year" />
              </div>
              <div className="space-y-2">
                <Label>Current CGPA</Label>
                <Input name="cgpa" type="number" step="0.01" value={formData.cgpa} onChange={handleInputChange} placeholder="e.g. 8.5" />
              </div>
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card className="border-none shadow-sm shadow-black/5">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-xl">Professional & Social</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Short Bio</Label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about your professional interests..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Skills (Comma separated)</Label>
                <Input name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. React, Node.js, Python, Figma" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/username" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Resume Upload */}
          <Card className="border shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">My Resume</CardTitle>
              <CardDescription>Upload your latest PDF resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative group border-2 border-dashed rounded-xl p-8 transition-colors hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer">
                <Input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleResumeUpload}
                />
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary group-hover:scale-110 transition-transform">
                    {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <FileIcon className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-bold">Click to Upload</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">PDF (MAX 5MB)</p>
                </div>
              </div>

              {uploadedResumeUrl && (
                <div className="pt-2">
                  <a
                    href={uploadedResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-muted rounded-xl text-sm font-bold hover:bg-muted/80 transition-colors"
                  >
                    <FileIcon className="h-4 w-4" />
                    Open Current Resume
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Profile Tip 💡</CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-90 leading-relaxed">
              Complete your profile and keep your resume updated to increase your chances of getting shortlisted by top companies.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

