// e:/try/lib/utils/twilio.ts
import twilio from 'twilio';

// Initialize Twilio client only if credentials are available
export const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured. OTPs will be logged to console.');
    return null;
  }
  
  return twilio(accountSid, authToken);
};

export const twilioClient = getTwilioClient();

// Mock function for development
const mockSendOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  console.log(`[MOCK] OTP for ${phoneNumber}: ${otp}`);
  return true;
};

// Send OTP via Twilio or mock in development
export const sendOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    if (!twilioClient) {
      return mockSendOTP(phoneNumber, otp);
    }

    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phoneNumber,
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    // Fallback to mock in case of error
    return mockSendOTP(phoneNumber, otp);
  }
};