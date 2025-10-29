const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { verifyToken } = require('../middleware/auth');

// create note
router.post('/', verifyToken, async (req, res) => {
  const { mood, note, date } = req.body;
  try {
    const newNote = new Note({ user: req.user.id, mood, note, date });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get user's notes
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// update note
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (note.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// delete note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (note.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await note.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
