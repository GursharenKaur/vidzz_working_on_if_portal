const { sendEmail, generateOTP } = require('./src/utils/workingGmailService');

async function testWorkingGmail() {
    console.log('=== TESTING WORKING GMAIL SERVICE ===');
    
    try {
        const result = await sendEmail(
            'rvsaxena1821@gmail.com',
            '🎯 WORKING GMAIL TEST',
            'This is a test email from working Gmail service.',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
                <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h2>🎯 WORKING GMAIL SERVICE</h2>
                    <p style="margin: 10px 0; font-size: 16px;">Testing Gmail delivery!</p>
                    <p style="margin: 10px 0; font-size: 14px;">Check your Gmail inbox now.</p>
                </div>
                <div style="padding: 20px; text-align: center; color: #666;">
                    <p>From: Working Gmail Service</p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            `
        );
        
        console.log('📧 Working Gmail Test Result:', result);
        
        if (result.success) {
            console.log('✅ SUCCESS! Email service is working with:', result.service);
            console.log('📬 Check your Gmail inbox for test email.');
            console.log('🔐 OTP shown in console:', result.otp);
        } else {
            console.log('❌ FAILED:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testWorkingGmail();
