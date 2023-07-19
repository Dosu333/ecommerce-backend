const mongoose = require('mongoose');
const {Product} = require('./product');

const orderItemSchema = mongoose.Schema({
    product: Product,
    quantity: {
        type: Number,
        default: 0
    }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema)