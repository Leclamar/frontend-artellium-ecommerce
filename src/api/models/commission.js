const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    sender_id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'completed'],
    default: 'draft'
  }
});

module.exports = mongoose.model('Commission', commissionSchema);
