"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth"
import { studentApi } from "@/lib/api/student"

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  shortlisted: { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  accepted: { color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
  rejected: { color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
}

export default function ApplicationsPage() {
  const { token } = useAuthStore()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchApplications = async () => {
      try {
        const data = await studentApi.getApplications()
        if (data) {
          setApplications(data)
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [token])

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track all your internship applications</p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">You haven't applied to any roles yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <Card key={app._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {app.roleId?.companyId?.name || "Unknown Company"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{app.roleId?.title || "Unknown Position"}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={`capitalize ${statusConfig[app.status.toLowerCase()]?.color}`} variant="secondary">
                      {app.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

