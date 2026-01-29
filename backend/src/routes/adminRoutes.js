const express = require('express');
const router = express.Router();
const {
  addCompany,
  deleteCompany,
  getCompanies,
  bulkUploadStudents,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes protected and for admin only
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/company', addCompany);
router.get('/companies', getCompanies); // Keep plural for list
router.delete('/company/:id', deleteCompany);
router.post('/student/bulk', bulkUploadStudents);
router.get('/stats', getStats);

module.exports = router;
