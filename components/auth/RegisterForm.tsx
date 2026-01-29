// e:/try/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Student specific
    rollNo: '',
    year: '',
    branch: '',
    // Company specific
    companyName: '',
    industry: '',
    website: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ REAL REGISTER HANDLER (BACKEND CONNECTED)
  const handleRoleSelect = (selectedRole: 'student' | 'company') => {
    setRole(selectedRole);
    setStep('form');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formattedPhone = formData.phone.startsWith('+')
        ? formData.phone
        : `+91${formData.phone}`;

      const baseData = {
        name: role === 'company' ? formData.companyName : formData.name,
        email: formData.email,
        password: formData.password,
        phone: formattedPhone,
        role,
      };

      const roleSpecificData = role === 'student' ? {
        rollNo: formData.rollNo,
        year: formData.year,
        branch: formData.branch,
      } : {
        industry: formData.industry,
        website: formData.website,
        address: formData.address,
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...baseData,
          ...roleSpecificData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      useAuthStore.getState().setAuth(
        data.token,
        data.role,
        data.user
      );

      // Redirect based on role
      router.push(`/${role}/dashboard`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {step === 'role' ? 'Create an account' : `Register as ${role}`}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 'form' && (
            <button
              type="button"
              onClick={() => setStep('role')}
              className="font-medium text-primary hover:text-primary/90 mr-2"
            >
              ← Back
            </button>
          )}
          Or{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:text-primary/90"
          >
            sign in to your existing account
          </button>
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {step === 'role' ? (
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className="w-full justify-start px-6 py-8 text-lg"
              variant="outline"
            >
              <div className="text-left">
                <h3 className="font-bold">I'm a Student</h3>
                <p className="text-sm font-normal text-gray-500 mt-1">
                  Looking for internships and job opportunities
                </p>
              </div>
            </Button>

            <Button
              type="button"
              onClick={() => handleRoleSelect('company')}
              className="w-full justify-start px-6 py-8 text-lg"
              variant="outline"
            >
              <div className="text-left">
                <h3 className="font-bold">I'm a Company</h3>
                <p className="text-sm font-normal text-gray-500 mt-1">
                  Looking to hire talented students
                </p>
              </div>
            </Button>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            {role === 'student' ? (
              <>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input
                    id="rollNo"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    required
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 3rd"
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Finance, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Company's physical address"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91XXXXXXXXXX"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating {role} account...
              </>
            ) : (
              `Create ${role} account`
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
