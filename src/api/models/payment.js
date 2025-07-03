const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  action_name: {
    type: String,
  },
  details: {
    payment_id: String,
    amount: Number,
    commission_id: String
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  payment_date: {
    type: Date
  }
});

module.exports = mongoose.model('Payment', userSchema);