const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
         },
        status: {
            type: String,
            enum: ['pending', 'processed'],
            default: 'pending'
        }
    }],
    remote_data: {
        type: String
    }
});

module.exports = mongoose.model('Cart', cartSchema);
