'use strict'

const { toObjectIdMongo } = require('../../utils')
const apiKeyModel = require('../api.key.model')

const createApiKey = async (id) => {
    const newKey = await apiKeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        accountId: toObjectIdMongo(id),
    })
    return newKey.key
}

const findApiKey = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true })
    return objKey
}

module.exports = { findById }
const addPermission = async (id, permission) => { }
const removePermission = async (id, permission) => { }
const disableApiKey = async (id, permission) => { }

module.exports = {
    createApiKey,
    findApiKey,
    addPermission,
    removePermission,
    disableApiKey
}