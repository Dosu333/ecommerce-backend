require('dotenv/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'))

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

const Product = mongoose.model('Product', productSchema);

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hairdresser',
        image: 'some_url'
    };

    res.send(product);
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save()
    .then((createdProduct => {
        res.status(201).json({
            success: true,
            product: createdProduct
        })
    }))
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
})

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'commerce-database'
})
.then(() => {
    console.log('DB connected');
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log(api);
    console.log('server is running on localhost');
})