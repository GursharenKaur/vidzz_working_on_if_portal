// Mock data for admin analytics
const mockAnalytics = {
  globalStats: {
    totalStudents: 2847,
    totalCompanies: 156,
    totalApplications: 8934,
    activeRoles: 342,
  },
  companies: [
    { id: 1, name: "TechCorp", email: "hr@techcorp.com", location: "San Francisco, CA", roles: 5, applications: 48 },
    { id: 2, name: "InnovateLabs", email: "hr@innovatelabs.com", location: "New York, NY", roles: 3, applications: 32 },
    {
      id: 3,
      name: "DesignStudio",
      email: "hr@designstudio.com",
      location: "Los Angeles, CA",
      roles: 2,
      applications: 18,
    },
  ],
  students: [
    { id: 1, name: "John Doe", email: "john@example.com", university: "MIT", major: "Computer Science" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", university: "Stanford", major: "Software Engineering" },
    { id: 3, name: "Mark Johnson", email: "mark@example.com", university: "UC Berkeley", major: "Data Science" },
  ],
}

export const adminApi = {
  async getGlobalStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalytics.globalStats)
      }, 300)
    })
  },

  async getAllCompanies() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalytics.companies)
      }, 300)
    })
  },

  async deleteCompany(companyId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  },

  async getAllStudents() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAnalytics.students)
      }, 300)
    })
  },

  async deleteStudent(studentId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  },

  async uploadStudentsCSV(file: File) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, imported: 150 })
      }, 1000)
    })
  },

  async getAnalytics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          applicationStats: [
            { month: "Jan", applications: 1200, accepted: 100 },
            { month: "Feb", applications: 1800, accepted: 180 },
            { month: "Mar", applications: 2400, accepted: 300 },
          ],
        })
      }, 300)
    })
  },
}
