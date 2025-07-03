const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mask: {
    type: String,
    required: true
  },
  use: {
    type: String,
    enum: ['admin', 'customer', 'agent'],
    required: true
  },
  logs: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);