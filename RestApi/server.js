'use strict'

require('dotenv').config();
const app = require('./src/app')

const PORT = process.env.PORT || 3003

const server = app.listen(PORT, () => {
    console.log(`Start with port ${PORT}`);
})


