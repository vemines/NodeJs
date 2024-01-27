'use strict'

const bcrypt = require('bcrypt')
const crypto = require('node:crypto')

const { getInfoData, randomString } = require('../utils')
const { BadRequestError, ForbiddenError, UnAuthorizedError, InternalServerError } = require('../utils/error.response')

const { createTokenPair } = require('../utils/auth.util')
const userSvc = require('./user.svc')     // const userModel = require('../models/user.model')
const keyTokenSvc = require('./key.token.1.svc')

class AccessService1 {

    static refreshToken = async ({ keyStore, user, refresh_token, access_token }) => {
        const { usr_slug, email, _id } = user


        // check token isUsed
        if (keyStore.refresh_tokens_used.includes(refresh_token)) {
            await keyTokenSvc.processSusToken(usr_slug, refresh_token, access_token)
            throw new ForbiddenError(' Something wrng happend !! Pls relogin 1')
        }

        // check refresh token isMatch
        if (keyStore.refresh_token != refresh_token) {
            await keyTokenSvc.processSusToken(usr_slug, refresh_token, access_token)
            throw new ForbiddenError(' Something wrng happend !! Pls relogin 2')
        }

        // check Userid
        const foundUser = await userSvc.findUserByEmail(email)
        if (!foundUser) throw new UnAuthorizedError(' User not registeted')

        // create new token
        const tokens = await createTokenPair({
            payload: { usr_slug, email, _id },
            publicKey: keyStore.public_key,
            privateKey: keyStore.private_key,
        })

        // update token
        await keyStore.updateOne({
            $set: {
                refresh_token: tokens.refresh_token
            },
            $addToSet: {
                refreshTokensUsed: refresh_token
            }
        })
        return {
            user: getInfoData({ fields: ["usr_slug", "usr_name", "usr_email", "usr_status"], object: foundUser }),
            tokens
        }
    }

    static signOut = async (usr_slug) => {
        return await keyTokenSvc.clearRefreshToken(usr_slug)
    }

    static signIn = async ({ email, password }) => {
        // check email exist in db
        const foundUser = await userSvc.findUserByEmail(email)
        if (!foundUser) throw new BadRequestError('User not registered')

        const { _id, usr_slug, usr_salt, usr_password } = foundUser
        // match password
        const match = await bcrypt.compare(password + usr_salt, usr_password)

        if (!match) throw new UnAuthorizedError('Authentication error')

        // created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({
            payload: { usr_slug, email, _id },
            publicKey: publicKey,
            privateKey: privateKey,
        })

        await keyTokenSvc.createKeyToken({
            usr_id: _id,
            usr_slug: usr_slug,
            refresh_token: tokens.refresh_token,
            public_key: publicKey,
            private_key: privateKey,
        })

        return {
            user: getInfoData({ fields: ["usr_slug", "usr_name", "usr_email", "usr_status"], object: foundUser }),
            tokens: tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // check email exists
        const holderUser = await userSvc.findUserByEmail(email)
        if (holderUser) {
            throw new BadRequestError('Error: User already exist')
        }

        // hash password
        const salt = randomString()
        const passwordHash = await bcrypt.hash(password + salt, 10)

        const userSlug = randomString()
        // create new user
        const newUser = await userSvc.createUser({
            usr_name: name,
            usr_slug: userSlug,
            usr_salt: salt,
            usr_email: email,
            usr_password: passwordHash,
        })

        // if create user succeed
        if (newUser) {
            return getInfoData({ fields: ["usr_slug", "usr_name", "usr_email", "usr_status"], object: newUser })
        }

        return new InternalServerError('something went wrong code (x8cv97kjker)')
    }
}

module.exports = AccessService1