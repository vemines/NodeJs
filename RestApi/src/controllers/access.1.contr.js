'use strict'

const AccessService1 = require('../services/access.1.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')

const HEADER = {
    CLIENT_ID: 'x-client-id',
    ACCESSTOKEN: 'x-access-token',
}

class AccessController {

    static handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Refresh token Success',
            metadata: await AccessService1.refreshToken({
                refresh_token: req.refresh_token,
                user: req.user,
                keyStore: req.keyStore, // key token
                access_token: req.access_token
            }),
        }).send(res)
    }

    static handleSignOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService1.signOut(req.user.usr_slug),
        }).send(res)
    }

    static handleSignIn = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService1.signIn(req.body),
        }).send(res)
    }

    static handleSignUp = async (req, res, next) => {
        new CreatedResponse({
            message: 'Register Success',
            metadata: await AccessService1.signUp(req.body),
        }).send(res)
    }
}

module.exports = AccessController