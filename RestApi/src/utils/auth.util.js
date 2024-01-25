'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../utils/error.response')
// const { findByUserId } = require('../services/keyToken.service')


const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'Authorization',
    REFRESHTOKEN: 'x-refresh-token',
}

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('error creating token pair:: ', error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // Check userId exist
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    // Get access token in db
    // const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    if (req.headers[HEADER.REFRESHTOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN]
        // console.log(refreshToken)
        // console.log(keyStore)
        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

        // check is userId match decodeUser.userId
        if (userId != decodeUser.userId) throw new AuthFailureError('Invalid Userid')

        req.keyStore = keyStore
        req.user = decodeUser
        req.refreshToken = refreshToken

        return next()
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}



module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
}