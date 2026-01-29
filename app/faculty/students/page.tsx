"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye } from "lucide-react"

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

export default function FacultyStudentsPage() {
  const [search, setSearch] = useState("")

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.university.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">View student accounts and records</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, email, or university..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>{filtered.length} students found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-sm">{student.email}</TableCell>
                    <TableCell className="text-sm">{student.university}</TableCell>
                    <TableCell className="text-sm">{student.major}</TableCell>
                    <TableCell className="text-sm">{student.applications}</TableCell>
                    <TableCell className="text-sm">{student.joinDate}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
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
