const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Company = require('../models/Company');
const Student = require('../models/Student');
const Application = require('../models/Application');

// @desc    Add a company
// @route   POST /api/admin/companies
// @access  Private/Admin
const addCompany = asyncHandler(async (req, res) => {
  const { name, email, password, description, website } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role: 'COMPANY'
  });

  if (user) {
    // Create Company Profile
    const company = await Company.create({
      userId: user._id,
      name,
      description,
      website,
      verified: true // Admin added, so verified?
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      company: company
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Delete a company
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompany = asyncHandler(async (req, res) => {
  // ID passed could be User ID or Company ID. Let's assume Company ID for list, but we need to delete User too?
  // Let's assume ID is Company ID.
  const company = await Company.findById(req.params.id);

  if (company) {
    // Delete User associated?
    await User.findByIdAndDelete(company.userId);
    await company.deleteOne();
    res.json({ message: 'Company removed' });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private/Admin
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({}).populate('userId', 'name email');
  res.json(companies);
});

// @desc    Bulk upload students
// @route   POST /api/admin/students/batch
// @access  Private/Admin
const bulkUploadStudents = asyncHandler(async (req, res) => {
  const studentsData = req.body; // Array of { name, email, password, rollNo, branch, year, cgpa }

  if (!Array.isArray(studentsData)) {
    res.status(400);
    throw new Error('Input must be an array of students');
  }

  const results = [];
  const errors = [];

  for (const student of studentsData) {
    try {
      // Check existence
      const userExists = await User.findOne({ email: student.email });
      if (userExists) {
        errors.push({ email: student.email, message: 'User already exists' });
        continue;
      }

      const user = await User.create({
        name: student.name,
        email: student.email,
        password: student.password, // Ideally random or provided
        role: 'STUDENT'
      });

      const studentProfile = await Student.create({
        userId: user._id,
        rollNo: student.rollNo,
        branch: student.branch,
        year: student.year,
        cgpa: student.cgpa
      });

      results.push({ email: user.email, status: 'Created' });
    } catch (error) {
      errors.push({ email: student.email, message: error.message });
    }
  }

  res.json({ results, errors });
});

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  // using Aggregation for counts (or just countDocuments)
  const totalStudents = await Student.countDocuments();
  const totalCompanies = await Company.countDocuments();
  const totalApplications = await Application.countDocuments();

  res.json({
    totalStudents,
    totalCompanies,
    totalApplications
  });
});

module.exports = {
  addCompany,
  deleteCompany,
  getCompanies,
  bulkUploadStudents,
  getStats
};
