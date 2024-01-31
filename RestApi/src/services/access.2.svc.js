'use strict'

const bcrypt = require('bcrypt')
const crypto = require('node:crypto')

const UserService = require('./user.svc')
const KeyTokenService = require('./key.token.2.svc')

const { getInfoData, randomString } = require('../utils')
const { BadRequestError, ForbiddenError, UnAuthorizedError, InternalServerError } = require('../utils/error.response')
const { createTokenPair, createTokenPair2 } = require('../utils/auth.util')


class AccessService2 {

    static refreshToken = async ({ keyStore, payload, refresh_token, access_token }) => {
        const { usr_slug, email, _id } = payload

        // check token isUsed
        if (keyStore.refresh_tokens_used.includes(refresh_token)) {
            await KeyTokenService.processSusToken({ usr_slug, refresh_token, access_token })
            throw new ForbiddenError(' Something wrng happend !! Pls relogin 2')
        }

        // check refresh token isMatch
        if (keyStore.refresh_token != refresh_token) {
            await KeyTokenService.processSusToken({ usr_slug, refresh_token, access_token })
            throw new ForbiddenError(' Something wrng happend !! Pls relogin 2')
        }

        // check Userid
        const foundUser = await UserService.findUserByEmail({ email })
        if (!foundUser) throw new UnAuthorizedError('User not registeted')

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        })

        // create token
        const tokens = await createTokenPair2({
            payload: { usr_slug, email, _id },
            privateKey: privateKey,
        })

        // update token
        await keyStore.updateOne({
            $set: { refresh_token: tokens.refresh_token },
            $addToSet: { refreshTokensUsed: refresh_token }
        })
        return {
            user: getInfoData({
                fields: ["usr_slug", "usr_name", "usr_email", "usr_status"],
                object: foundUser
            }),
            tokens
        }
    }

    static signOut = async ({ usr_slug }) => {
        const result = await KeyTokenService.clearRefreshToken({ usr_slug })
        return result
    }

    static signIn = async ({ email, password }) => {
        // check email exist in db
        const foundUser = await UserService.findUserByEmail({ email })
        if (!foundUser) throw new BadRequestError('User not registered')
        const { _id, usr_slug, usr_salt, usr_password } = foundUser

        // match password
        const match = await bcrypt.compare(password + usr_salt, usr_password)
        if (!match) throw new UnAuthorizedError('Authentication error')

        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        })

        // created token pair
        const tokens = await createTokenPair2({
            payload: { usr_slug, email, _id },
            publicKey: publicKey,
            privateKey: privateKey,
        })

        await KeyTokenService.createKeyToken({
            usr_id: _id,
            usr_slug: usr_slug,
            public_key: publicKey,
            refresh_token: tokens.refresh_token
        })

        return {
            user: getInfoData({
                fields: ["usr_slug", "usr_name", "usr_email", "usr_status"],
                object: foundUser
            }),
            tokens: tokens
        }
    }

    static signUp = async ({ name, email, password }) => {

        // check email exists
        const foundUser = await UserService.findUserByEmail({ email })
        if (foundUser) {
            throw new BadRequestError('Error: User already exist')
        }

        // hash password
        const salt = randomString()
        const passwordHash = await bcrypt.hash(password + salt, 10)

        const userSlug = randomString()
        // create new user
        const newUser = await UserService.createUser({
            usr_name: name,
            usr_slug: userSlug,
            usr_salt: salt,
            usr_email: email,
            usr_password: passwordHash,
        })


        // if create user succeed
        if (newUser) {
            return getInfoData({
                fields: ["usr_slug", "usr_name", "usr_email", "usr_status"],
                object: newUser
            })
        }

        return new InternalServerError('Create user error)')
    }
}

module.exports = AccessService2