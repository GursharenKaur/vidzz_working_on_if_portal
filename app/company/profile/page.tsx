//app/company/profile/page.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { companyApi } from "@/lib/api/company"
import { Loader2, Upload, Trash2 } from "lucide-react"

interface CompanyData {
  name: string
  email: string
  phone: string
  website: string
  location: string
  about: string
  logoUrl?: string
}

export default function CompanyProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    about: ""
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Check authentication and load profile data
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const data = await companyApi.getProfile()
        setCompanyData({
          name: data.name || "",
          email: data.contactEmail || data.email || "",
          phone: data.contactPhone || data.phone || "",
          website: data.website || "",
          location: data.address?.city || data.location || "",
          about: data.description || data.about || "",
          logoUrl: data.logo
        })
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/login')
        toast({
          title: "Authentication Required",
          description: "Please log in to access the company profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router, toast])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Reset file input
    if (e.target) {
      e.target.value = '';
    }

    // Validate file type
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JPEG file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);

    try {
      setIsUploading(true);

      console.log('Starting file upload...');
      const result = await companyApi.uploadLogo(file);

      console.log('File upload successful, updating UI...');
      setCompanyData(prev => ({
        ...prev,
        logoUrl: result.logoUrl || result.filePath
      }));

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });

    } catch (error: any) {
      console.error('Error in handleLogoChange:', error);

      // More specific error messages based on error type
      let errorMessage = 'Failed to upload logo. Please try again.';

      if (error.message.includes('Network Error')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The request timed out. Please try again.';
      } else if (error.response) {
        // Server responded with an error status code
        errorMessage = error.response.data?.message || errorMessage;
      }

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Reset the file input on error
      setLogoFile(null);

    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!companyData.logoUrl) return;

    if (confirm("Are you sure you want to remove the company logo?")) {
      try {
        setIsUploading(true);
        await companyApi.deleteLogo();

        setCompanyData(prev => ({
          ...prev,
          logoUrl: undefined
        }));
        setLogoFile(null);

        toast({
          title: "Success",
          description: "Logo removed successfully",
        });
      } catch (error: any) {
        console.error('Error removing logo:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to remove logo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: companyData.name,
        contactEmail: companyData.email,
        contactPhone: companyData.phone,
        website: companyData.website,
        description: companyData.about,
        address: {
          city: companyData.location
        }
      }
      await companyApi.updateProfile(payload);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Company Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Update your company details and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={companyData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleInputChange}
                    placeholder="Enter contact email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={companyData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={companyData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={companyData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <textarea
                  id="about"
                  name="about"
                  value={companyData.about}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your company..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Column - Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
            <CardDescription>Upload PNG, JPG, max 5MB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-dashed rounded-lg p-4 text-center bg-muted/50">
              <input
                type="file"
                id="logo-upload"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleLogoChange}
                className="hidden"
                disabled={isUploading}
              />
              <label
                htmlFor="logo-upload"
                className={`flex flex-col items-center justify-center space-y-4 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {companyData.logoUrl || logoFile ? (
                  <div className="relative w-full aspect-square rounded-md overflow-hidden bg-white">
                    <img
                      src={
                        logoFile
                          ? URL.createObjectURL(logoFile)
                          : companyData.logoUrl?.startsWith('http')
                            ? companyData.logoUrl
                            : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${companyData.logoUrl}`
                      }
                      alt="Company Logo Preview"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/200x200?text=Logo+Not+Found';
                      }}
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLogo();
                        }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-8 w-full flex flex-col items-center">
                    <div className="p-4 rounded-full bg-background mb-4 shadow-sm border">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">Click to upload</p>
                      <p className="text-muted-foreground">or drag and drop</p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <Button
              className="w-full"
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {companyData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}