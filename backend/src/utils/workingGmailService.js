const { Resend } = require('resend');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const otp = generateOTP();

    console.log('==========================================');
    console.log('🔐 YOUR OTP IS:', otp);
    console.log('📧 EMAIL:', to);
    console.log('⏰ TIME:', new Date().toLocaleTimeString());
    console.log('==========================================');

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "Internship Portal <noreply@tvctiet.in>",
      to: to,
      subject: subject,
      html: html || text,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent via Resend:", data?.id);

    return {
      success: true,
      messageId: data?.id,
      otp: otp,
      service: "Resend",
    };

  } catch (error) {
    console.error("❌ Critical email error:", error);
    return { success: false, error };
  }
};

module.exports = { sendEmail, generateOTP };
