const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    let profile = null;
    const role = user.role.toUpperCase(); // Ensure uppercase for comparison

    if (role === 'STUDENT') {
      profile = await Student.findOne({ userId: user._id });
    } else if (role === 'COMPANY') {
      profile = await Company.findOne({ userId: user._id });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(), // Convert role to lowercase for frontend
      profile: profile, // Return specific profile data
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...profileData } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role.toUpperCase() // Ensure uppercase for enum
  });

  if (user) {
    // Create specific profile based on role
    if (role.toLowerCase() === 'student') {
      await Student.create({
        userId: user._id,
        rollNo: profileData.rollNo || 'N/A',
        branch: profileData.branch || 'N/A',
        year: profileData.year || 'N/A',
        cgpa: 0 // Default
      });
    } else if (role.toLowerCase() === 'company') {
      await Company.create({
        userId: user._id,
        name: profileData.name || user.name,
        description: profileData.industry || 'Tech',
        website: profileData.website || 'http://example.com',
        verified: false // Default unverified
      });
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(), // Convert to lowercase
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  loginUser,
  registerUser
};