'use strict'

const { forEach } = require('lodash')
const { toObjectIdMongo, randomString } = require('../../utils')
const { BadRequestError } = require('../../utils/error.response')
const model = require('../api.key.model')


class ApiKeyRepository {
    static findOneAndUpdate = async ({ filter, update, options }) => {
        return await model.findOneAndUpdate(filter, update, options)
    }

    //  projection { field: 1 / 0 } 0 for exclude field and default if not declaire
    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
}

const createApiKey = async (ip_address) => {
    const key = randomString()

    const newKey = await model.findOneAndUpdate(
        { ip_address: ip_address },
        { $set: { key: key } },
        { upsert: true, new: true })

    return newKey.key
}

const findApiKey = async (key) => {
    const apiKey = await model.findOne({ key, status: true })
    return apiKey
}

const addPermission = async (key, permissions) => {
    //   check is permission exist
    const foundKey = await model.findOne({ key })

    if (!foundKey) {
        throw new BadRequestError('Key not found')
    }

    forEach(permissions, (permission) => {
        if (foundKey.permissions.includes(permission)) {
            throw new BadRequestError('Permission already exists')
        }
    })

    const apiKey = await model.findOneAndUpdate(
        { key, status: true },
        { $addToSet: { permissions: permissions } },
        { upsert: true, new: true })

    return apiKey
}

module.exports = ApiKeyRepository