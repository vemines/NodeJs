'use strict'

const initTempModel = require('../init.temp.model')

const findInitTempById = async (id) => {
    return await initTempModel.findById(id)
}

module.exports = {
    findInitTempById
}