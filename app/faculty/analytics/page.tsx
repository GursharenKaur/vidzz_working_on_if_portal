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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications by University</CardTitle>
            <CardDescription>Top universities by application volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={universityApplications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="university" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#a78bfa" />
                <Bar dataKey="accepted" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications by Role</CardTitle>
            <CardDescription>Popular positions and acceptance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rolePopularity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#a78bfa" />
                <Bar dataKey="accepted" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Conversion Funnel</CardTitle>
          <CardDescription>Applications vs acceptances and rejections over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationConversion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#a78bfa" strokeWidth={2} name="Total Applications" />
              <Line type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={2} name="Accepted" />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
