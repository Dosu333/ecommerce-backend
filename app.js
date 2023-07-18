
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose')
const Product = require('./models/product')
const productsRouter = require('./routers/product')

// Environment variables
require('dotenv/config');
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'))

// Routers
app.use(`${api}/products`, productsRouter)

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