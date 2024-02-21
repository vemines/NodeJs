'use strict'

const mongoose = require('mongoose')

function connectMongo(uri) {
    const db = mongoose.createConnection(uri)

    db.on('connected', function () {
        console.log(`Connect Mongodb success: ${this.name} `)
    })

    db.on('error', function (err) {
        console.log(`Connect Mongodb Error:: ${err}`)
    })

    return db
}

const conectionString1 = "mongodb://localhost:27017/NodeJs-TipsJS-01"
const conectionString2 = "mongodb://localhost:27017/NodeJs-Backend"

const db1 = connectMongo(conectionString1)
const db2 = connectMongo(conectionString2)

module.exports = {
    db1,
    db2,
}

