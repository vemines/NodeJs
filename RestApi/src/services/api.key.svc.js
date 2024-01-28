'use strict';

const { createApiKey, findApiKey, addPermission, removePermission } = require('../models/repositories/api.key.repo');

class ApiKeyService {
    static createNewApiKey = async (ip_address) => {
        return createApiKey(ip_address);
    };

    static findApiKeyByKey = async (key) => {
        return await findApiKey(key);
    };

    static addPermissionToKey = async ({ key, permissions }) => {
        return await addPermission(key, permissions);
    };

    static removePermissionFromKey = async ({ key, permissions }) => {
        return await removePermission(key, permissions);
    };
};

module.exports = ApiKeyService;