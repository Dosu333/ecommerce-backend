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
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
        image: req.body.image
    })

    const createdCategory = await category.save();
    if (!createdCategory) {
        res.status(401).json({
            success: false,
            error:'Category cannot be created'
        })
    }
    res.status(201).json(createdCategory)
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if (category) {
            res.status(200).json({
                success: true
            })
        }
        res.status(404).json({
            success: false,
            error: 'Category not found'
        })
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err
        })
    })
})
module.exports = router