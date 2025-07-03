const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: {
    type: Number,
    required: true
  },
    receiver_id: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    is_read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Message', messageSchema);
