'use strict'

const { UnAuthorizedError } = require('../utils/error.response')
const { handleFindApiKey } = require('../services/api.key.svc')
const { asyncHandler } = require('../utils/async.handler.util')

const KeyTokenSvc1 = require('../services/key.token.1.svc')
const KeyTokenSvc2 = require('../services/key.token.2.svc')

const verifyJWT = require('../utils/auth.util')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    ACCESSTOKEN: 'x-access-token',
    REFRESHTOKEN: 'x-refresh-token',
}

const apikey = async (req, res, next) => {
    // check api key
    const key = req.headers[HEADER.API_KEY]
    if (!key) {
        throw new UnAuthorizedError('API key missing')
    }
    // check authorization
    const objKey = await handleFindApiKey(key)
    if (!objKey) {
        throw new UnAuthorizedError('Forbidden Error')
    }
    req.objKey = objKey
    return next()
}

const permission = (permission) => async (req, res, next) => {
    if (!req.objKey.permissions) {
        throw new UnAuthorizedError('Permission denied')
    }

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
        throw new UnAuthorizedError('Permission denied')
    }
    return next()
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
        let decodeUser = verifyJWT(access_token, keyStore.public_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }

        decodeUser = verifyJWT(refresh_token, keyStore.private_key)
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
        let decodeUser = verifyJWT(access_token, keyStore.public_key)
        if (!!decodeUser) {
            setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug)
            return next()
        }

        decodeUser = verifyJWT(refresh_token, keyStore.public_key)
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