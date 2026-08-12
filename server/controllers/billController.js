const Bill = require('../models/Bill');

// GET /api/bills
// Tenants see their own bills. Owners see all of them.
const getBills = async (req, res) => {
  try {
    const filter = req.user.role === 'tenant' ? { tenant: req.user._id } : {};

    const bills = await Bill.find(filter)
      .populate('tenant', 'name email')
      .sort('-createdAt');

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/bills  (owner only)
const createBill = async (req, res) => {
  try {
    const { month, rent, electricity, water, internet, dueDate, tenant, property } = req.body;

    if (!month || !rent || !dueDate || !tenant) {
      return res.status(400).json({ message: 'Month, rent, due date and tenant are all required.' });
    }

    const bill = await Bill.create({
      month,
      rent,
      electricity,
      water,
      internet,
      dueDate,
      tenant,
      property,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/bills/:id/pay  (tenant only)
const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'No bill found with that id.' });
    }

    if (bill.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only pay your own bills.' });
    }

    if (bill.status === 'paid') {
      return res.status(400).json({ message: 'This bill is already settled.' });
    }

    bill.status = 'paid';
    bill.paidOn = new Date();
    await bill.save();

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBills, createBill, payBill };