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

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hairdresser',
        image: 'some_url'
    };

    res.send(product);
})

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
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