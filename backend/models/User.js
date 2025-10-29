const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  journalName: { type: String, default: 'My Journal' },
  settings: {
    theme: { type: String, default: 'sakura' },
    showGifBg: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    streakGoal: { type: Number, default: 7 },
    autoSaveJournal: { type: Boolean, default: true },
    showMoodTypeReminder: { type: Boolean, default: true },
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
