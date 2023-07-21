const {User} = require('../models/user')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// List users
router.get('/', async (req, res) => {
    const userList = await User.find().select('-passwordHash');
    if (!userList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(userList);
})

// User detail
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({
            success: false
        })
    }
    res.send(user);
})

// Create a user
router.post('/', (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin
    })

    user.save()
    .then(createdUser => {
        if (!createdUser) {
            return res.status(401).json({
                success: false,
                error:'User cannot be created'
            })
        }
        res.status(201).json(createdUser)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            error: err
        })
    })
    
});

// User login
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.JWT_SECRET;

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {expiresIn: '1d'}
        )
        return res.status(200).send({user: user.email, token:token});
    } else {
        return res.status(400).json({
            success: false,
            error: 'Invalid credentials'
        })
    }
})

module.exports = router
