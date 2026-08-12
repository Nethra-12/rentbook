const Bill = require('../models/Bill');
const Complaint = require('../models/Complaint');
const Property = require('../models/Property');

// GET /api/tenant/summary
const getTenantSummary = async (req, res) => {
  try {
    const bills = await Bill.find({ tenant: req.user._id }).sort('-createdAt');

    const currentBill = bills.find((b) => b.status === 'pending') || null;

    const totalPaid = bills
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.total, 0);

    const openComplaints = await Complaint.countDocuments({
      tenant: req.user._id,
      status: { $ne: 'resolved' },
    });

    res.json({
      room: currentBill?.room || '101',
      property: 'Your residence',
      amountDue: currentBill ? currentBill.total : 0,
      dueDate: currentBill ? currentBill.dueDate : null,
      openComplaints,
      totalPaid,
      currentBill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/owner/stats
const getOwnerStats = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });

    const rooms = properties.reduce((sum, p) => sum + p.rooms, 0);
    const occupied = properties.reduce((sum, p) => sum + p.occupied, 0);
    const monthlyIncome = properties.reduce((sum, p) => sum + p.occupied * p.monthlyRent, 0);

    const pendingPayments = await Bill.countDocuments({ status: 'pending' });
    const openComplaints = await Complaint.countDocuments({ status: { $ne: 'resolved' } });

    // Last six months of collected rent, oldest first.
    const paidBills = await Bill.find({ status: 'paid' });
    const buckets = {};

    paidBills.forEach((bill) => {
      const key = new Date(bill.paidOn).toLocaleString('en-IN', { month: 'short' });
      buckets[key] = (buckets[key] || 0) + bill.total;
    });

    const collections = Object.entries(buckets).map(([month, amount]) => ({ month, amount }));

    res.json({
      properties: properties.length,
      rooms,
      occupied,
      vacant: rooms - occupied,
      monthlyIncome,
      pendingPayments,
      openComplaints,
      collections: collections.length ? collections : [{ month: 'Aug', amount: 0 }],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTenantSummary, getOwnerStats };