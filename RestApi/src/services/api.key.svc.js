'use strict';

const ApiKeyRepository = require('../models/repositories/api.key.repo');

const { randomString } = require('../utils');

class ApiKeyService {
    static createNewApiKey = async ({ ip_address }) => {
        const key = randomString()

        const newKey = await ApiKeyRepository.findOneAndUpdate({
            filter: { ip_address: ip_address },
            update: { $set: { key: key } },
            options: { upsert: true, new: true }
        })

        return newKey.key;
    };

    static findApiKeyByKey = async ({ key }) => {
        const foundKey = await ApiKeyRepository.findOne(
            { filter: { key, status: true } }
        )
        return foundKey;
    };

    static addPermissionToKey = async ({ key, permissions }) => {
        const foundKey = await ApiKeyRepository.findOne(
            { filter: { key } }
        )
        if (!foundKey) throw new BadRequestError('Key not found')

        const apiKey = await ApiKeyRepository.findOneAndUpdate({
            filter: { key, status: true },
            update: { $addToSet: { permissions: permissions } },
            options: { new: true }
        })
        return apiKey;
    };

    static removePermissionFromKey = async ({ key, permissions }) => {
        const foundKey = await ApiKeyRepository.findOne(
            { filter: { key } }
        )
        if (!foundKey) throw new BadRequestError('Key not found')

        const apiKey = await ApiKeyRepository.findOneAndUpdate({
            filter: { key, status: true },
            // or { $pull: { permissions: { $in: permissions } } },
            update: { $pullAll: { permissions: permissions } },
            options: { upsert: true, new: true }
        })

        return apiKey
    };
};

module.exports = ApiKeyService;