"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Trash2 } from "lucide-react"

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Company Management</h1>
        <p className="text-muted-foreground">Manage registered companies</p>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies by name or email..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Companies</CardTitle>
          <CardDescription>{filtered.length} companies found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell className="text-sm">{company.email}</TableCell>
                    <TableCell className="text-sm">{company.location}</TableCell>
                    <TableCell className="text-sm">{company.roles}</TableCell>
                    <TableCell className="text-sm">{company.applications}</TableCell>
                    <TableCell className="text-sm">{company.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant={company.status === "active" ? "default" : "secondary"}>{company.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
