'use strict'

const { UnAuthorizedError } = require('../utils/error.response')
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'athorization'
}

const { findById } = require('../services/api.key.svc')

const apikey = async (req, res, next) => {
    try {
        // check api key
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            throw new UnAuthorizedError('API key missing')
        }

        // check authorization
        const objKey = await findById(key)
        if (!objKey) {
            throw new UnAuthorizedError('Forbidden Error')
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        console.log(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied',
            })
        }

        console.log('permissions::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied',
            })
        }
        return next()
    }
}

module.exports = {
    apikey,
    permission,
}