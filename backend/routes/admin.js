const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/auth');

// 🧩 Middleware: Admin Check
const ensureAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin')
      return res.status(403).json({ message: 'Admin access only' });
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

// 🧭 Get admin overview
router.get('/overview', verifyToken, ensureAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const postsCount = await Post.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    res.json({ usersCount, postsCount, recentUsers });
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 Manage users: list all
router.get('/users', verifyToken, ensureAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Delete a user
router.delete('/users/:id', verifyToken, ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
