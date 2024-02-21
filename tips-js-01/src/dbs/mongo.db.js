'use strict'

const mongoose = require('mongoose')
const { db: { host, port, name } } = require('../configs/mongodb.config')

const connectString = `mongodb://${host}:${port}/${name}`

// Singleton
class Database {
    constructor() {
        this.connect()
    }
    //connect
    connect(type = 'mongodb') {
        mongoose.connect(connectString, {
            maxPoolSize: 50     // after 50th need await (line up) to excute
        }).catch(err => console.log(err))
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb