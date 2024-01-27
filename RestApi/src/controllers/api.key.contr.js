'use strict'

const ApiKeyService = require('../services/api.key.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')

class ApiKeyController {
    static createNewApiKey = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create Api key Success',
            metadata: await ApiKeyService.handleCreateApiKey(
                req.ip
            ),
        }).send(res)
    }
}

module.exports = ApiKeyController