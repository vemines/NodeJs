'use strict'

const JWT = require('jsonwebtoken')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    ACCESSTOKEN: 'x-access-token',
    REFRESHTOKEN: 'x-refresh-token',
}

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        const access_token = JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        const refresh_token = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        return { access_token, refresh_token }
    } catch (error) {
        console.error('error creating token pair:: ', error)
    }
}

//  JWT.verify(accessToken, publicKey)
const createTokenPair2 = async ({ payload, privateKey }) => {
    try {
        const access_token = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1 days',
        })
        const refresh_token = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        })

        return { access_token, refresh_token }

    } catch (error) {
        console.error('error creating token pair:: ', error)
    }
}

const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    createTokenPair2,
    verifyJWT,
}