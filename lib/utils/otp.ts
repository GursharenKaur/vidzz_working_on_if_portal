// e:/try/lib/utils/otp.ts
// In-memory store for demo purposes (use a database in production)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with phone number and expiration (5 minutes)
export const storeOTP = (phoneNumber: string, otp: string): void => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  otpStore[phoneNumber] = { otp, expiresAt };
  
  // Clean up expired OTPs
  Object.keys(otpStore).forEach(key => {
    if (otpStore[key].expiresAt < Date.now()) {
      delete otpStore[key];
    }
  });
};

// Verify OTP
export const verifyOTP = (phoneNumber: string, otp: string): boolean => {
  const record = otpStore[phoneNumber];
  if (!record || record.expiresAt < Date.now()) {
    return false;
  }
  return record.otp === otp;
};