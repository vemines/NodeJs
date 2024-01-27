'use strict'

const { UnAuthorizedError } = require('../utils/error.response')
const { findById } = require('../services/api.key.svc')
const { asyncHandler } = require('../utils/async.handler.util')
const JWT = require('jsonwebtoken')
const KeyTokenSvc1 = require('../services/key.token.1.svc')
const KeyTokenSvc2 = require('../services/key.token.2.svc')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    ACCESSTOKEN: 'x-access-token',
    REFRESHTOKEN: 'x-refresh-token',
}

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

const authentication = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_slug = req.headers[HEADER.CLIENT_ID]
    if (!usr_slug) throw new UnAuthorizedError('Invalid Request')

    // Get key token in db
    const keyStore = await KeyTokenSvc1.findKeyByUserSlug(usr_slug)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    if (!!req.headers[HEADER.ACCESSTOKEN] && !!req.headers[HEADER.REFRESHTOKEN]) {
        const access_token = req.headers[HEADER.ACCESSTOKEN]
        const refresh_token = req.headers[HEADER.REFRESHTOKEN]
        let decodeUser = JWT.verify(access_token, keyStore.public_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }

        decodeUser = JWT.verify(refresh_token, keyStore.private_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }
    }

    throw new BadRequestError('Bad request')
})

const authentication2 = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_slug = req.headers[HEADER.CLIENT_ID]
    if (!usr_slug) throw new UnAuthorizedError('Invalid Request')

    // Get key token in db
    const keyStore = await KeyTokenSvc2.findKeyByUserSlug(usr_slug)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    if (!!req.headers[HEADER.ACCESSTOKEN] && !!req.headers[HEADER.REFRESHTOKEN]) {
        const access_token = req.headers[HEADER.ACCESSTOKEN]
        const refresh_token = req.headers[HEADER.REFRESHTOKEN]
        let decodeUser = JWT.verify(access_token, keyStore.public_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }

        decodeUser = JWT.verify(refresh_token, keyStore.public_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }
    }
    throw new BadRequestError('Bad request')
})

function setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug) {
    if (usr_slug != decodeUser.usr_slug) throw new AuthFailureError('Invalid User')
    req.keyStore = keyStore
    req.user = decodeUser
    req.refresh_token = refresh_token
    req.access_token = access_token
}



module.exports = {
    apikey,
    permission,
    authentication2,
    authentication,
}