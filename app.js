
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())
app.options('*', cors())


// Environment variables
require('dotenv/config');
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'))

// Routers
const productsRouter = require('./routers/product')

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