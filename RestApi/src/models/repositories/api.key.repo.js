'use strict'

const { forEach } = require('lodash')
const { toObjectIdMongo, randomString } = require('../../utils')
const { BadRequestError } = require('../../utils/error.response')
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
    const apiKey = await apiKeyModel.findOne({ key, status: true })
    return apiKey
}

const addPermission = async (key, permissions) => {
    // check is permission exist
    const holderKey = await apiKeyModel.findOne({ key })

    if (!holderKey) {
        throw new BadRequestError('Key not found')
    }

    forEach(permissions, (permission) => {
        if (holderKey.permissions.includes(permission)) {
            throw new BadRequestError('Permission already exists')
        }
    })

    const apiKey = await apiKeyModel.findOneAndUpdate(
        { key, status: true },
        { $addToSet: { permissions: permissions } },
        { upsert: true, new: true })

    return apiKey
}
const removePermission = async (key, permissions) => {
    // check is permission exist
    const holderKey = await apiKeyModel.findOne({ key })

    forEach(permissions, (permission) => {
        if (!holderKey.permissions.includes(permission)) {
            throw new BadRequestError('Permission not exists')
        }
    })

    const apiKey = await apiKeyModel.findOneAndUpdate(
        { key, status: true },
        { $pullAll: { permissions: permissions } },
        // { $pull: { permissions: { $in: permissions } } },
        { upsert: true, new: true })

    return apiKey
}
const disableApiKey = async (key) => {
    const apiKey = await apiKeyModel.findOneAndUpdate(
        { key, status: true },
        { $set: { status: false } },
        { upsert: true, new: true })
    return apiKey
}

module.exports = {
    createApiKey,
    findApiKey,
    addPermission,
    removePermission
}