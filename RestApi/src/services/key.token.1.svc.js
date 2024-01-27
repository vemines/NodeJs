'use strict';

const { createToken, findByUserSlug, removeRefreshTokens, moveToSuspiciousToken } = require('../models/repositories/key.token.1.repo');

class KeyTokenService {
    static createKeyToken = async ({ usr_id, usr_slug, public_key, private_key, refresh_token }) => {
        return await createToken(usr_id, usr_slug, public_key, private_key, refresh_token)
    }

    static clearRefreshToken = async (usr_slug) => {
        return await removeRefreshTokens(usr_slug)
    }
    static processSusToken = async (usr_slug, refresh_token, access_token) => {
        return await moveToSuspiciousToken(usr_slug, refresh_token, access_token)
    }

    static findKeyByUserSlug = async (usr_slug) => {
        return await findByUserSlug(usr_slug)
    }

}

module.exports = KeyTokenService