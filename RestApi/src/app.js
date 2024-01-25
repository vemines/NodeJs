'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

//init dbs 
require('./v1/dbs/mongo.db')

//user middleware
app.use(helmet())
app.use(morgan('combined'))
// compress responses
app.use(compression())

// add body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//router
app.use(require('./v1/routes/'))

// Error Handling 404

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error handler Internal Server Error (500)
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: 'error',
            stack: error.stack,
            code: statusCode,
            message: error.message || 'Internal Server Error'
        },
    });
});

module.exports = app;