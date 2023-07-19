const mongoose = require('mongoose');
const OrderItem = require('./orderitem');
const User = require('./user')

const orderSchema = mongoose.Schema({
    orderitems: [OrderItem],
    shippingAddress1: String,
    shippingAddress2: String,
    city: String,
    zip: String,
    country: String,
    phone: Number,
    status: String,
    totalPrice: Number,
    user: User,
    dateOrdered: Date
})

exports.Order = mongoose.model('Order', orderSchema)