'use strict'

const { toObjectIdMongo, randomString } = require('../../utils')
const apiKeyModel = require('../api.key.model')

const createApiKey = async (ip_address) => {
    const key = randomString()

    const newKey = await apiKeyModel.findOneAndUpdate(
        { ip_address: ip_address },
        { $set: { key: key } },
        { upsert: true, new: true })

    return newKey.key
}

const findApiKey = async (key) => {
    const objKey = await apiKeyModel.findOne({ key, status: true })
    return objKey
}

const addPermission = async (id, permission) => { }
const removePermission = async (id, permission) => { }
const disableApiKey = async (id, permission) => { }

module.exports = {
    createApiKey,
    findApiKey
}