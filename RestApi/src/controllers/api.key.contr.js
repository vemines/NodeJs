'use strict'

const ApiKeyService = require('../services/api.key.svc')

class ApiKeyController {
    static createTempApiKey = async () => {
        new SuccessRequest({
            message: 'Action Name Success',
            metadata: await ApiKeyService.createTempApiKey(),
        }).send(res)
    }
}

module.exports = new ApiKeyController()