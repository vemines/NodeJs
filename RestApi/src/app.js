'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

const AppLogger = require('./loggers/log.logger')

//init dbs 
require('./dbs/mongo.db')

app.use(helmet())
app.use(morgan('combined'))
// compress responses
app.use(compression())

// add body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('trust proxy', true)

//router
app.use(require('./routes/'))

// Error Handling 404

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error handler Internal Server Error (500)
app.use((error, req, res, next) => {
    // console.error(error) // need this line for quick link to error postions
    AppLogger.error({
        message: error.message || 'Internal Server Error',
        context: req.baseUrl + req.url,
        metadata: error.status || 500
    })

    res.status(error.status || 500).send({
        error: {
            status: 'error',
            stack: error.stack,
            code: error.status || 500,
            message: error.message || 'Internal Server Error'
        },
    });
});

module.exports = app;