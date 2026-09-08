const express = require('express');

const PlatformMessage = require('../models/PlatformMessage');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin: Create a platform message
router.post('/admin', auth, requireAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Title is required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Message is required'
      });
    }

    const platformMessage = await PlatformMessage.create({
      title: title.trim(),
      message: message.trim()
    });

    res.status(201).json(platformMessage);
  } catch (error) {
    console.error('Create platform message error:', error);

    res.status(500).json({
      message: 'Failed to create platform message'
    });
  }
});

// Admin: Get all platform messages
router.get('/admin/all', auth, requireAdmin, async (req, res) => {
  try {
    const messages = await PlatformMessage.find()
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Get admin platform messages error:', error);

    res.status(500).json({
      message: 'Failed to fetch platform messages'
    });
  }
});

// Users: Get platform messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await PlatformMessage.find()
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Get platform messages error:', error);

    res.status(500).json({
      message: 'Failed to fetch platform messages'
    });
  }
});

module.exports = router;