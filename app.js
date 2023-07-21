
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')

app.use(cors())
app.options('*', cors())


// Environment variables
require('dotenv/config');
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING

// middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Routers
const productsRoutes = require('./routers/product');
const categoryRoutes = require('./routers/category');
const usersRoutes = require('./routers/user');

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/users`, usersRoutes);

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