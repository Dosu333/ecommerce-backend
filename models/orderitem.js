const mongoose = require('mongoose');
const {Product} = require('./product');

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema)