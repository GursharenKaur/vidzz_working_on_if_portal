//lib/api/company.ts

import { axiosInstance } from "@/lib/utils/axios"
import { useAuthStore } from "@/lib/store/auth"

interface CompanyProfile {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  about?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  logo?: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
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
    return response.data.data || response.data
  },

  async updateProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const response = await axiosInstance.put('/company/profile', data)
    return response.data.data || response.data
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
    formData.append('logo', file, file.name)

    const token = useAuthStore.getState().token;
    // CRITICAL: Force 127.0.0.1 to match working ping and avoid localhost resolution issues
    const backendURL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace('localhost', '127.0.0.1');
    const uploadUrl = `${backendURL}/api/company/logo`;

    console.log('--- Exhaustive Upload Diagnostic Start ---');
    console.log('Target URL:', uploadUrl);
    console.log('Auth Token:', token ? token.substring(0, 10) + '...' : 'MISSING');
    console.log('File Data:', { name: file.name, size: file.size, type: file.type });

    try {
      console.log('Initiating fetch request...');
      const response = await fetch(uploadUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      console.log('HTTP Response Status:', response.status, response.statusText);

      const text = await response.text();
      console.log('Raw Response (first 500 chars):', text.substring(0, 500));

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('Response is not valid JSON');
        data = { message: text };
      }

      if (!response.ok) {
        console.error('Server returned error status:', response.status);
        throw new Error(data.message || 'Server error during upload');
      }

      console.log('Upload success result:', data);
      return data;
    } catch (error: any) {
      console.error('===== FATAL UPLOAD ERROR =====');
      console.error('Type:', error.name);
      console.error('Message:', error.message);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('POSSIBLE CAUSES: 1. Server crashed 2. CORS preflight failed 3. Network connection reset');
      }
      console.error('Context:', { url: uploadUrl, filename: file.name });
      throw error;
    }
  },

  async deleteLogo(): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete('/company/logo')
    return response.data
  }
}
