'use strict';

const { createApiKey, findApiKey, addPermission, removePermission } = require('../models/repositories/api.key.repo');

class ApiKeyService {
    static handleCreateApiKey = async (ip_address) => {
        return createApiKey(ip_address);
    };

    static handleFindApiKey = async (key) => {
        return await findApiKey(key);
    };

    static handleAddPermission = async ({ key, permissions }) => {
        return await addPermission(key, permissions);
    };

    static handleRemovePermission = async ({ key, permissions }) => {
        return await removePermission(key, permissions);
    };
};

module.exports = ApiKeyService;