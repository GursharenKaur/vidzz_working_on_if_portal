const { sendEmail, generateOTP } = require('./src/utils/properResendService');

async function diagnoseEmailIssue() {
    console.log('==========================================');
    console.log('🔍 EMAIL DELIVERY DIAGNOSTIC');
    console.log('==========================================');
    
    console.log('\n📧 Testing email delivery to rvsaxena1821@gmail.com...');
    
    const result = await sendEmail(
        'rvsaxena1821@gmail.com',
        '🔍 EMAIL DELIVERY TEST',
        'This is a diagnostic test email.',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #FF0000; border-radius: 10px;">
            <div style="background: #FF0000; color: white; padding: 20px; text-align: center;">
                <h2>🔍 EMAIL DELIVERY DIAGNOSTIC</h2>
                <p style="margin: 10px 0; font-size: 16px;">Testing email delivery!</p>
                <p style="margin: 10px 0; font-size: 14px;">If you receive this, email is working!</p>
            </div>
            <div style="padding: 20px; text-align: center; color: #666;">
                <p>From: Diagnostic Service</p>
                <p>Time: ${new Date().toLocaleString()}</p>
                <p>Service: Testing...</p>
            </div>
        </div>
        `
    );
    
    console.log('\n📊 Email Test Results:');
    console.log('✅ Success:', result.success);
    console.log('📧 Service Used:', result.service);
    console.log('🆔 Message ID:', result.messageId);
    console.log('🔐 OTP Generated:', result.otp);
    
    console.log('\n🔍 EMAIL DELIVERY ANALYSIS:');
    if (result.service === 'Resend') {
        console.log('✅ Resend API working - Check Gmail inbox');
    } else if (result.service === 'Gmail') {
        console.log('✅ Gmail SMTP working - Check Gmail inbox');
    } else if (result.service === 'console') {
        console.log('⚠️ Both email services failed - Using console OTP');
        console.log('🔧 This means email delivery is not working');
    }
    
    console.log('\n📱 CHECK THESE LOCATIONS:');
    console.log('1. Gmail Primary Inbox');
    console.log('2. Gmail Spam Folder');
    console.log('3. Gmail Promotions Tab');
    console.log('4. Gmail Social Tab');
    console.log('5. Gmail Updates Tab');
    console.log('6. All Mail Folder');
    
    console.log('\n🎯 IMMEDIATE SOLUTION:');
    console.log('• Use console OTP for instant verification');
    console.log('• OTP shown above: ' + result.otp);
    console.log('• Registration will work with console OTP');
    
    console.log('==========================================');
}

diagnoseEmailIssue();
