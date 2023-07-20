const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

router.get('/', async (req, res) => {
    const productList = await Product.find().select('name image category -_id').populate('category');
    if (!productList) {
        return res.status(500).json({
            success: false
        })
    }
    res.send(productList);
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')

    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'product not found'
        }) 
    }
    res.status(200).send(product);
})

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category)
    if(!category) {
        return res.status(400).json({
            success: false, 
            error: 'Invalid category'
        })
    }
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    const createdProduct = await product.save()
    if (!createdProduct) {
        return res.status(500).json({
            success: false,
            error: 'Product was not created'
        })
    }
    res.status(201).json(createdProduct)
}) 

module.exports = router;