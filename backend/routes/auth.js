// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔹 Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'moodbotsecret',
    { expiresIn: '1h' }
  );
};

// ✅ LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        journalName: user.journalName || 'My Journal',
      },
      role: user.role || 'user',
      token,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ✅ SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const journalName = `${name.split(' ')[0]}'s Journal`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      journalName,
    });

    await newUser.save();
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        journalName: newUser.journalName,
      },
      role: newUser.role || 'user',
      token,
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ✅ UPDATE PROFILE
router.put('/update', async (req, res) => {
  try {
    const { id, name, email, journalName } = req.body;

    if (!id) return res.status(400).json({ message: 'User ID is required.' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Apply updates only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (journalName) user.journalName = journalName;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        journalName: user.journalName,
      },
    });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ✅ GET USER PROFILE (for /auth/me)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'moodbotsecret');

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        journalName: user.journalName,
        settings: user.settings,
      },
    });
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

// ✅ UPDATE SETTINGS
router.put('/settings', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'moodbotsecret');

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { theme, showGifBg, notifications, streakGoal, autoSaveJournal, showMoodTypeReminder } = req.body;

    // Update settings
    if (theme !== undefined) user.settings.theme = theme;
    if (showGifBg !== undefined) user.settings.showGifBg = showGifBg;
    if (notifications !== undefined) user.settings.notifications = notifications;
    if (streakGoal !== undefined) user.settings.streakGoal = streakGoal;
    if (autoSaveJournal !== undefined) user.settings.autoSaveJournal = autoSaveJournal;
    if (showMoodTypeReminder !== undefined) user.settings.showMoodTypeReminder = showMoodTypeReminder;

    await user.save();

    res.status(200).json({
      message: 'Settings updated successfully',
      settings: user.settings,
    });
  } catch (err) {
    console.error('❌ Update settings error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ✅ VERIFY TOKEN (Optional, but useful for protected routes)
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'moodbotsecret');

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({
      message: 'Token is valid',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        journalName: user.journalName,
      },
    });
  } catch (err) {
    console.error('❌ Token verification error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
