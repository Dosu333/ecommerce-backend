const {Order} = require('../models/order')
const express = require('express');
const { OrderItem } = require('../models/orderitem');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    if (!orderList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(orderList);
})

// Order detail
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name').sort({'dateOrdered': -1})
    .populate({ 
        path: 'orderitems', 
        populate: { path: 'product', populate: 'category' } 
    });

    if (!order) {
        res.status(500).json({
            success: false
        })
    }
    res.send(order);
})

// Create order endpoint
router.post('/', async (req, res) => {
    // Create orderItem
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem => {
        let newOrderItem = new OrderItem({
            quantity: orderitem.quantity,
            product: orderitem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    
    // Calculate total price of order
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0);

    // Create Order
    let order = new Order({
        orderitems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
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


// Update order status endpoint
router.put('/:id', (req, res) => {
    Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    }, {new: true})
    .then(order => {
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order with ID not found'
            })
        }
        res.status(200).send(order)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            error: err
        })
    })
})


// Delete order endpoint
router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id)
    .then(async order => {
        if (order) {
            await order.orderitems.map(async orderitem => {
                await OrderItem.findByIdAndRemove(orderitem)
            })
            return res.status(200).json({
                success: true
            })
        }
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        })
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            error: err
        })
    })
})


// Get total Sales endpoint
router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])
    if(!totalSales) {
        return res.status(400).json({
            success: false,
            error: 'The order sales cannot be generated'
        })
    }
    return res.status(200).json({
        success: true,
        totalsales: totalSales.pop().totalsales
    })
})


// Get orders count
router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments();
    if (!orderCount) {
        return res.status(500).json({
            success: false
        })
    }
    res.send({
        success: true,
        count: orderCount
    });
})

module.exports = router