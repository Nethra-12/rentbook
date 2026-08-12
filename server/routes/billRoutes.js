const express = require('express');
const { getBills, createBill, payBill } = require('../controllers/billController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getBills).post(restrictTo('owner'), createBill);
router.post('/:id/pay', restrictTo('tenant'), payBill);

module.exports = router;