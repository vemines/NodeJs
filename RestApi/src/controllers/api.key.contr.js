'use strict'

const ApiKeyService = require('../services/api.key.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')

class ApiKeyController {
    static createNewApiKey = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create Api key Success',
            metadata: await ApiKeyService.handleCreateApiKey(req.ip),
        }).send(res)
    }

    static addPermissionApiKey = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Permission Success',
            metadata: await ApiKeyService.handleAddPermission(req.body),
        }).send(res)
    }

    static removePermissionApiKey = async (req, res, next) => {
        new SuccessResponse({
            message: 'Remove Permission Success',
            metadata: await ApiKeyService.handleRemovePermission(req.body),
        }).send(res)
    }
}

module.exports = ApiKeyController