const mongoose = require('mongoose')
const Category = require('./category')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    richDescription: String,
    image: String,
    images: [String],
    brand: String,
    price: {
        type: Number,
        required: true
    },
    category: Category,
    countInStock: {
        type: Number,
        default: 0
    },
    rating: Number,
    isFeatured: Boolean,
    dateCreated: Date
})

exports.Product = mongoose.model('Product', productSchema);