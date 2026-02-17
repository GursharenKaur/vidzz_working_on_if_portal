const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  loginUser,
  registerUser,
  verifyOtp,
  resendOtp,
} = require('../controllers/authController');

const getRateLimitKey = (req) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  return email ? `${ip}:${email}` : String(ip);
};

// Rate limit for actions that send OTPs (register + resend)
// Increased to avoid sign-in flow breaking during rapid retries.
const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getRateLimitKey,
  message: {
    message:
      'Too many OTP requests from this IP/email, please try again after 15 minutes.',
  },
});

// Rate limit for OTP verification attempts
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getRateLimitKey,
  message: {
    message:
      'Too many OTP verification attempts, please try again after 15 minutes.',
  },
});

router.post('/login', loginUser);
router.post('/register', otpSendLimiter, registerUser);
router.post('/verify-otp', otpVerifyLimiter, verifyOtp);
router.post('/resend-otp', otpSendLimiter, resendOtp);

module.exports = router;
