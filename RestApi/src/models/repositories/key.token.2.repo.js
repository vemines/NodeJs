'use strict'

const { toObjectIdMongo } = require('../../utils')
const { ForbiddenError, UnAuthorizedError, InternalServerError } = require('../../utils/error.response')
const keyTokenModel = require('../key.token.2.model')
const suspiciousTokenModel = require('../suspicious.token.model')

const newToken = async (usr_id, usr_slug, public_key, refresh_token) => {
    const doc = await keyTokenModel.create({
        usr_id: toObjectIdMongo(usr_id),
        usr_slug: usr_slug,
        refresh_token: refresh_token,
        refresh_tokens_used: [],
        public_key: public_key,
    })
    return doc.public_key
}

const createToken = async (usr_id, usr_slug, public_key, refresh_token) => {
    const token = await findByUserSlug(usr_slug);

    if (!token) {
        // Create a new token if it doesn't exist
        return newToken(usr_id, usr_slug, public_key, refresh_token);
    }

    // check token exist and token.refresh_tokens_used contain refresh_token
    if (token && token.refresh_tokens_used.includes(refresh_token)) {
        throw new ForbiddenError('something went wrong code(zxc8x7c89zc)')
    }

    const update = {
        public_key,
        refresh_token
    };
    // if empty not change refresh_token_used
    if (refresh_token !== "") {
        update.$addToSet = { refresh_tokens_used: token.refresh_token };
    }

    const options = { upsert: true, new: true };

    await token.updateOne(update, options)
    return token.public_key
}

const removeRefreshTokens = async (usr_slug) => {
    console.log(usr_slug);
    const token = await findByUserSlug(usr_slug);

    if (!token) {
        throw new UnAuthorizedError('Invalid Request')
    }

    const update = {
        $addToSet: { refresh_tokens_used: token.refresh_token },
        $set: { refresh_token: "" }
    };

    const options = { upsert: true, new: true };

    return await token.updateOne(update, options);
}
const moveToSuspiciousToken = async (usr_slug, refresh_token, access_token) => {
    const tokenData = await findByUserSlug(usr_slug);

    if (tokenData) {
        await suspiciousTokenModel.create({
            access_token: access_token,
            usr_id: tokenData.usr_id,
            usr_slug: tokenData.usr_slug,
            public_key: tokenData.public_key,
            refresh_token: tokenData.refresh_token,
        })
        await keyTokenModel.updateOne(
            { usr_slug: usr_slug },
            { $pull: { refresh_tokens_used: refresh_token } }
        );
        await removeRefreshTokens(usr_slug)

        return;
    }
    throw new InternalServerError('something went wrong code(89adsd9087b)')
}



const findByUserSlug = async (usr_slug) => {
    return await keyTokenModel.findOne({ usr_slug: usr_slug })
}

const removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ userId: id })
}

const findExistRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
}

const findRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken })
}

const deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.findOneAndDelete({ userId: userId })
}

module.exports = {
    createToken,
    findByUserSlug,
    removeRefreshTokens,
    moveToSuspiciousToken
}