const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
    {
        swap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Swap',
            required: true,
            index: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    'ChatMessage',
    chatMessageSchema
);
