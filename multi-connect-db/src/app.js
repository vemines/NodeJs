'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

//init dbs 
require('./mongo.db')

//user middleware
app.use(helmet())
app.use(morgan('combined'))
// compress responses
app.use(compression())

// add body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const model = require('./model')
const test = async () => {
    console.log(await model.findOne())
}
test()

module.exports = app;