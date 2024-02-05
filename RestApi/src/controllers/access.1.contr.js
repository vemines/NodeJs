'use strict'

const AccessService1 = require('../services/access.1.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')

class AccessController {
    static handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Refresh token Success',
            metadata: await AccessService1.refreshToken({
                refresh_token: req.refresh_token,
                payload: req.payload,
                keyStore: req.keyStore, // key token
                access_token: req.access_token
            })

        }).send(res)
    }

    static handleSignOut = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Logout Success',
            metadata: await AccessService1.signOut({
                usr_slug: req.payload.usr_slug
            })
        }).send(res)
    }

    static handleSignIn = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            metadata: await AccessService1.signIn({
                email: req.body.email,
                password: req.body.password,
            })
        }).send(res)
    }

    static handleSignUp = async (req, res, next) => {
        new CreatedResponse({
            message: 'Register Success',
            metadata: await AccessService1.signUp({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            })
        }).send(res)
    }
}

module.exports = AccessController