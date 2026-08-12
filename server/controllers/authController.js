const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'An account already exists with that email.' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      token: generateToken(user._id, user.role),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'That email and password combination does not match an account.' });
    }

    res.json({
      token: generateToken(user._id, user.role),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};
module.exports = { registerUser, loginUser, getMe };