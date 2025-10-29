const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const { verifyToken } = require('../middleware/auth');

// create journal entry
router.post('/', verifyToken, async (req, res) => {
  const { text, gratitude, mood, date } = req.body;
  try {
    const newEntry = new JournalEntry({ user: req.user.id, text, gratitude, mood, date });
    await newEntry.save();
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get user's journal entries
router.get('/', verifyToken, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// update journal entry
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Not found' });
    if (entry.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(entry, req.body);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// delete journal entry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Not found' });
    if (entry.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await entry.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
