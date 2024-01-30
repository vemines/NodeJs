'use strict'

const ApiKeyService = require('../services/api.key.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')

class ApiKeyController {
    static handleCreateNewApiKey = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create Api key Success',
            metadata: await ApiKeyService.createNewApiKey({
                ip_address: req.ip
            })
        }).send(res)
    }

    static handleAddPermissionApiKey = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Permission Success',
            metadata: await ApiKeyService.addPermissionToKey({
                key: req.body.key,
                permissions: req.body.permissions
            })
        }).send(res)
    }

    static handleRemovePermissionApiKey = async (req, res, next) => {
        new SuccessResponse({
            message: 'Remove Permission Success',
            metadata: await ApiKeyService.removePermissionFromKey({
                key: req.body.key,
                permissions: req.body.permissions
            })
        }).send(res)
    }
}

module.exports = ApiKeyController