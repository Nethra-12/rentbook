const Complaint = require('../models/Complaint');
const express = require('express');
const {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getComplaints).post(restrictTo('tenant'), createComplaint);
router.route('/:id').put(restrictTo('owner'), updateComplaintStatus);

module.exports = router;