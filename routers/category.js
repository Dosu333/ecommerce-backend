const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find()
    if (!categoryList) {
        return res.status(500).json({
            success: false
        })
    }
    res.status(200).send(categoryList)
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({
            success: false,
            error: 'Category with given ID was not found',
        })
    }
    res.status(200).send(category)
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
        return res.status(401).json({
            success: false,
            error:'Category cannot be created'
        })
    }
    res.status(201).json(createdCategory)
});

router.put('/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        image: req.body.image,
    }, {new: true})
    .then(category => {
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category with ID not found'
            })
        }
        res.status(200).send(category)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            error: err
        })
    })
})

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if (category) {
            return res.status(200).json({
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