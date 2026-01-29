// e:/try/app/api/auth/otp/request/route.ts
import { NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/utils/otp';
import { sendOTP } from '@/lib/utils/twilio';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number to E.164 format
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(formattedPhone, otp);

    // Send OTP
    const otpSent = await sendOTP(formattedPhone, otp);

    if (!otpSent) {
      throw new Error('Failed to send OTP');
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // For development/testing only
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Error in OTP request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send OTP',
      },
      { status: 500 }
    );
  }
}