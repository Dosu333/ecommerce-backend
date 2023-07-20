const {Product} = require('../models/product')
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

// Product list. Can be filtered by categories.
router.get('/', async (req, res) => {
    let filter = {};

    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        return res.status(500).json({
            success: false
        })
    }
    res.send(productList);
})

// Product detail
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

// Create product
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

// Update product
router.put('/:id', async (req, res) => {
    const category = await Category.findById(req.body.category)
    if(!category) {
        return res.status(400).json({
            success: false, 
            error: 'Invalid category'
        })
    }

    Product.findByIdAndUpdate(req.params.id, {
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
    }, {new: true})
    .then(product => {
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product with ID not found'
            })
        }
        res.status(200).send(product)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            error: err
        })
    })
})

// Delete product
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if (product) {
            return res.status(200).json({
                success: true
            })
        }
        res.status(404).json({
            success: false,
            error: 'Product not found'
        })
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err
        })
    })
})

// Get products count
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if (!productCount) {
        return res.status(500).json({
            success: false
        })
    }
    res.send({
        count: productCount
    });
})

// Get featured products. Can specify the amount of products to be returned. 0 returns all products
router.get('/get/featured/:count', async (req, res) => {
    const products = await Product.find({isFeatured: true}).limit(+req.params.count);
    if (!products) {
        return res.status(500).json({
            success: false
        })
    }
    res.send(products)
})

module.exports = router;