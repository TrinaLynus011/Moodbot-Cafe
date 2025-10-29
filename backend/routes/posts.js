  
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

// create post
router.post('/', verifyToken, async (req, res) => {
  const { content, media, moodTag } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const post = new Post({ user: req.user.id, userName: user.name, content, media, moodTag });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get posts (public)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(100);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// like a post
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// delete post (owner or admin)
const { isAdmin } = require('../middleware/auth');
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (post.user.toString() !== req.user.id) {
      // check admin
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    }
    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
