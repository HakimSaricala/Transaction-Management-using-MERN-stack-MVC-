const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    PaymentDate: String,
    Owner: String,
    Weight: Number,
    Quality: String,
    Amount: Number,
    Mode: String,
},{timestamps : true});



module.exports = mongoose.model('transaction', transactionSchema);