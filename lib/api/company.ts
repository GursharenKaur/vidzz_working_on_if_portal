import { axiosInstance } from "@/lib/utils/axios"

interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  about: string;
  logoUrl?: string;
}

interface UploadResponse {
  success: boolean;
  filePath: string;
  logoUrl: string;
}

export const companyApi = {
  // Company Profile
  async getProfile(): Promise<CompanyProfile> {
    const response = await axiosInstance.get('/company/profile')
    return response.data
  },

  async updateProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const response = await axiosInstance.put('/company/profile', data)
    return response.data
  },

  // Job Postings
  async getRoles() {
    const response = await axiosInstance.get('/company/jobs')
    return response.data
  },

  async createRole(roleData: any) {
    const response = await axiosInstance.post('/company/jobs', roleData)
    return response.data
  },

  async updateRole(jobId: string, roleData: any) {
    const response = await axiosInstance.put(`/company/jobs/${jobId}`, roleData)
    return response.data
  },

  async deleteRole(jobId: string) {
    const response = await axiosInstance.delete(`/company/jobs/${jobId}`)
    return response.data
  },

  // Applicants
  async getApplicants() {
    const response = await axiosInstance.get('/company/applicants')
    return response.data
  },

  async updateApplicantStatus(applicantId: string, status: string) {
    const response = await axiosInstance.put(`/company/applicants/${applicantId}/status`, { status })
    return response.data
  },

  // Dashboard Analytics
  async getDashboardAnalytics() {
    const response = await axiosInstance.get('/company/dashboard')
    return response.data
  },

  // Logo Upload
  async uploadLogo(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('logo', file)
    
    const response = await axiosInstance.post('/company/logo', formData)
    return response.data
  },

  async deleteLogo(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete('/company/logo')
    return response.data
  }
}
