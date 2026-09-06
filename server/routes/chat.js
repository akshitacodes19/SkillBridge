const express = require('express');
const router = express.Router();

const ChatMessage = require('../models/ChatMessage');
const Swap = require('../models/Swap');
const auth = require('../middleware/auth');

// Check whether the logged-in user belongs to the swap
async function checkSwapAccess(swapId, userId) {
    const swap = await Swap.findById(swapId);

    if (!swap) {
        return {
            allowed: false,
            status: 404,
            message: 'Swap not found'
        };
    }

    const isParticipant =
        swap.requester.toString() === userId.toString() ||
        swap.recipient.toString() === userId.toString();

    if (!isParticipant) {
        return {
            allowed: false,
            status: 403,
            message: 'You are not part of this swap'
        };
    }

    return {
        allowed: true,
        swap
    };
}

// GET /api/chat/:swapId
// Get previous messages
router.get('/:swapId', auth, async (req, res) => {
    try {
        const access = await checkSwapAccess(
            req.params.swapId,
            req.user._id
        );

        if (!access.allowed) {
            return res.status(access.status).json({
                message: access.message
            });
        }

        const messages = await ChatMessage.find({
            swap: req.params.swapId
        })
            .populate('sender', 'name profilePhoto')
            .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {
        console.error('Get chat error:', error);

        res.status(500).json({
            message: 'Failed to load chat messages'
        });
    }
});

// POST /api/chat/:swapId
// Send a message through REST API
router.post('/:swapId', auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: 'Message cannot be empty'
            });
        }

        const access = await checkSwapAccess(
            req.params.swapId,
            req.user._id
        );

        if (!access.allowed) {
            return res.status(access.status).json({
                message: access.message
            });
        }

        // Chat is available only for accepted swaps
        if (access.swap.status !== 'accepted') {
            return res.status(400).json({
                message:
                    'Chat is available only for accepted swaps'
            });
        }

        const newMessage = await ChatMessage.create({
            swap: req.params.swapId,
            sender: req.user._id,
            message: message.trim()
        });

        await newMessage.populate(
            'sender',
            'name profilePhoto'
        );

        res.status(201).json(newMessage);

    } catch (error) {
        console.error('Send chat error:', error);

        res.status(500).json({
            message: 'Failed to send message'
        });
    }
});

module.exports = router;