const Complaint = require('../models/Complaint');

// GET /api/complaints
// Tenants see their own. Owners see every complaint.
const getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'tenant' ? { tenant: req.user._id } : {};

    const complaints = await Complaint.find(filter)
      .populate('tenant', 'name email')
      .sort('-createdAt');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/complaints  (tenant only)
const createComplaint = async (req, res) => {
  try {
    const { title, description, priority, room } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are both required.' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      priority,
      room,
      tenant: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/complaints/:id  (owner only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, in-progress or resolved.' });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'No complaint found with that id.' });
    }

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComplaints, createComplaint, updateComplaintStatus };