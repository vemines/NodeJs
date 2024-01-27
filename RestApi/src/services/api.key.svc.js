'use strict';

const { createApiKey, findApiKey } = require('../models/repositories/api.key.repo');

class ApiKeyService {
    static handleCreateApiKey = async (ip_address) => {
        return createApiKey(ip_address);
    };

    static handleFindApiKey = async (key) => {
        return findApiKey(key);
    };
};

module.exports = ApiKeyService;