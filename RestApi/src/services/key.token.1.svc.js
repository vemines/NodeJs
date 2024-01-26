'use strict';

const { createToken, findByUserSlug, removeRefreshTokens, moveToSuspiciousToken } = require('../models/repositories/key.token.1.repo');

class KeyTokenService {
    static createKeyToken = async ({ usr_id, usr_slug, public_key, private_key, refresh_token }) => {
        return createToken(usr_id, usr_slug, public_key, private_key, refresh_token)
    }

    static clearRefreshToken = async (usr_slug) => {
        return removeRefreshTokens(usr_slug)
    }
    static processSusToken = async (usr_slug, refresh_token, access_token) => {
        return moveToSuspiciousToken(usr_slug, refresh_token, access_token)
    }

    static findKeyByUserSlug = async (usr_slug) => {
        return findByUserSlug(usr_slug)
    }

}

module.exports = KeyTokenService