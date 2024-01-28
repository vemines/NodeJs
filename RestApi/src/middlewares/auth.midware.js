'use strict'

const { UnAuthorizedError, NotFoundError } = require('../utils/error.response')
const { findApiKeyByKey } = require('../services/api.key.svc')
const { findUserById } = require('../services/user.svc')
const { asyncHandler } = require('../utils/async.handler.util')

const KeyTokenService1 = require('../services/key.token.1.svc')
const KeyTokenService2 = require('../services/key.token.2.svc')

const { verifyJWT } = require('../utils/auth.util')

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
    const objKey = await findApiKeyByKey(key)
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

const authenticationUser = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_slug = req.headers[HEADER.CLIENT_ID]
    if (!usr_slug) throw new UnAuthorizedError('Invalid Request')

    // Get key token in db
    const keyStore = await KeyTokenService1.findKeyByUserSlug(usr_slug)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    if (!!req.headers[HEADER.ACCESSTOKEN] && !!req.headers[HEADER.REFRESHTOKEN]) {
        const access_token = req.headers[HEADER.ACCESSTOKEN]
        const refresh_token = req.headers[HEADER.REFRESHTOKEN]
        let decodeUser = verifyJWT(access_token, keyStore.public_key)
        if (!!decodeUser) {
            return setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug, next)
        }

        decodeUser = verifyJWT(refresh_token, keyStore.private_key)
        if (!!decodeUser) {
            return setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug, next)
        }
    }

    throw new BadRequestError('Bad request')
})
const authenticationShop = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_id = req.payload._id
    if (!usr_id) throw new UnAuthorizedError('Invalid Request')

    const holderUser = await findUserById({ _id: usr_id })
    if (!holderUser) throw new NotFoundError('Not found User')

    if (holderUser.usr_is_seller || !holderUser.usr_shop_id) {
        req.shop_id = holderUser.usr_shop_id
        return next()
    }

    throw new BadRequestError('Bad request')
})

const authentication2 = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_slug = req.headers[HEADER.CLIENT_ID]
    if (!usr_slug) throw new UnAuthorizedError('Invalid Request')

    // Get key token in db
    const keyStore = await KeyTokenService2.findKeyByUserSlug(usr_slug)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    if (!!req.headers[HEADER.ACCESSTOKEN] && !!req.headers[HEADER.REFRESHTOKEN]) {
        const access_token = req.headers[HEADER.ACCESSTOKEN]
        const refresh_token = req.headers[HEADER.REFRESHTOKEN]
        let decodeUser = verifyJWT(access_token, keyStore.public_key)
        if (!!decodeUser) {
            return setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug, next)
        }

        decodeUser = verifyJWT(refresh_token, keyStore.public_key)
        if (!!decodeUser) {
            return setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug, next)
        }
    }
    throw new BadRequestError('Bad request')
})

function setRequestProperties(req, keyStore, decodeUser, refresh_token, access_token, usr_slug, next) {
    if (usr_slug != decodeUser.usr_slug) throw new UnAuthorizedError('Invalid User')

    req.keyStore = keyStore
    req.payload = decodeUser
    req.refresh_token = refresh_token
    req.access_token = access_token
    return next()
}



module.exports = {
    apikey,
    permission,
    authentication2,
    authenticationUser,
    authenticationShop,
}