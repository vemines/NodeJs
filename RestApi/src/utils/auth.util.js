'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./async.handler.util')
const { AuthFailureError, NotFoundError, UnAuthorizedError, BadRequestError } = require('../utils/error.response')
const KeyTokenSvc = require('../services/key.token.1.svc')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    ACCESSTOKEN: 'x-access-token',
    REFRESHTOKEN: 'x-refresh-token',
}

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        const access_token = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        const refresh_token = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        return { access_token, refresh_token }
    } catch (error) {
        console.error('error creating token pair:: ', error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const usr_slug = req.headers[HEADER.CLIENT_ID]
    if (!usr_slug) throw new UnAuthorizedError('Invalid Request')

    // Get access token in db
    const keyStore = await KeyTokenSvc.findKeyByUserSlug(usr_slug)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    if (req.headers[HEADER.REFRESHTOKEN]) {
        const access_token = req.headers[HEADER.ACCESSTOKEN]
        const refresh_token = req.headers[HEADER.REFRESHTOKEN]
        const decodeUser = JWT.verify(refresh_token, keyStore.private_key)

        // check is userId match decodeUser.userId
        if (usr_slug != decodeUser.usr_slug) throw new AuthFailureError('Invalid User')

        req.keyStore = keyStore
        req.user = decodeUser
        req.refresh_token = refresh_token
        req.access_token = access_token

        return next()
    }
    throw new BadRequestError('Bad request')
})

const verifyJWT = async (token, keySecret) => {
    return JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
}