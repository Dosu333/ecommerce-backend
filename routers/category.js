const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find()
    if (!categoryList) {
        res.status(500).json({
            success: false
        })
    }
    res.status(200).json(categoryList)
})

router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image
    })

    const createdCategory = await category.save()
    if (!createdCategory) {
        res.status(500).json({
            success: false
        })
    }
    res.status(201).json(createdCategory)
});

module.exports = router