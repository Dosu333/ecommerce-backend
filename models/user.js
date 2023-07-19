const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    street: String,
    apartment: String,
    city: String,
    zip: String,
    country: String,
    phone: String,
    isAdmin: Boolean
})

exports.User = mongoose.model('User', userSchema)