const {Order} = require('../models/order')
const express = require('express');
const { OrderItem } = require('../models/orderitem');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name', 'email');
    if (!orderList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList);
})

// Create order
router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem => {
        let newOrderItem = new OrderItem({
            quantity: orderitem.quantity,
            product: orderitem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    // console.log(orderItemsIdsResolved)

    let order = new Order({
        orderitems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user
    })

    const createdOrder = await order.save();
    if (!createdOrder) {
        return res.status(401).json({
            success: false,
            error:'Order cannot be created'
        })
    }
    res.status(201).json(createdOrder)
});
module.exports = router