'use strict'

require('dotenv').config();

const app = require('./src/app')

const PORT = 3999;

app.listen(PORT, () => {
    console.log(`WSV start with port ${PORT}`);
})

