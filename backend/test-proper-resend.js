const { sendEmail, generateOTP } = require('./src/utils/properResendService');

async function testProperResend() {
    console.log('=== TESTING PROPER RESEND SERVICE ===');
    
    try {
        const result = await sendEmail(
            'rvsaxena1821@gmail.com',
            '🚀 PROPER RESEND TEST',
            'This is a test email from proper Resend API.',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #0EA5E9; border-radius: 10px;">
                <div style="background: #0EA5E9; color: white; padding: 20px; text-align: center;">
                    <h2>🚀 PROPER RESEND API</h2>
                    <p style="margin: 10px 0; font-size: 16px;">Testing Resend email delivery!</p>
                    <p style="margin: 10px 0; font-size: 14px;">Check your Gmail inbox now.</p>
                </div>
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>From: Proper Resend Service</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            `
        );
        
        console.log('📧 Proper Resend Test Result:', result);
        
        if (result.success) {
            console.log('✅ SUCCESS! Resend service is working with:', result.service);
            console.log('📬 Check your Gmail inbox for test email.');
            console.log('🔐 OTP shown in console:', result.otp);
        } else {
            console.log('❌ FAILED:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testProperResend();
