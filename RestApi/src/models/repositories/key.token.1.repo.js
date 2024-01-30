'use strict'

const { toObjectIdMongo } = require('../../utils')
const { ForbiddenError, UnAuthorizedError, InternalServerError } = require('../../utils/error.response')
const model = require('../key.token.1.model')
const suspiciousTokenModel = require('../suspicious.token.model')

class KeyToken1Repository {

    static updateOne = async ({ filter, update, options }) => {
        return await model.updateOne(filter, update, options)
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

const newToken = async (usr_id, usr_slug, public_key, private_key, refresh_token) => {
    return await model.create({
        usr_id: toObjectIdMongo(usr_id),
        usr_slug: usr_slug,
        refresh_token: refresh_token,
        refresh_tokens_used: [],
        public_key: public_key,
        private_key: private_key,
    })
}

const createToken = async (usr_id, usr_slug, public_key, private_key, refresh_token) => {
    const token = await findByUserSlug(usr_slug);

    if (!token) {
        //   Create a new token if it doesn't exist
        return newToken(usr_id, usr_slug, public_key, private_key, refresh_token);
    }

    //   check token exist and token.refresh_tokens_used contain refresh_token
    if (token && token.refresh_tokens_used.includes(refresh_token)) {
        throw new ForbiddenError(' Something wrng happend !! Pls relogin')
    }

    const update = {
        public_key,
        private_key,
        refresh_token,
    };
    // if empty not change refresh_token_used
    if (token.refresh_token !== "") {
        update.$addToSet = { refresh_tokens_used: token.refresh_token };
    }

    const options = { upsert: true, new: true };

    return await token.updateOne(update, options);
}

const removeRefreshTokens = async (usr_slug) => {
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
            private_key: tokenData.private_key,
            refresh_token: tokenData.refresh_token,
        })
        await model.updateOne(
            { usr_slug: usr_slug },
            { $pull: { refresh_tokens_used: refresh_token } }
        );

        return await removeRefreshTokens(usr_slug)
    }
    throw new InternalServerError('something went wrong code(89adsd9087b)')
}



const findByUserSlug = async (usr_slug) => {
    return await model.findOne({ usr_slug: usr_slug })
}

const removeKeyById = async (id) => {
    return await model.deleteOne({ userId: id })
}

const findExistRefreshTokenUsed = async (refreshToken) => {
    return await model.findOne({ refreshTokensUsed: refreshToken }).lean()
}

const findRefreshToken = async (refreshToken) => {
    return await model.findOne({ refreshToken: refreshToken })
}

const deleteKeyByUserId = async (userId) => {
    return await model.findOneAndDelete({ userId: userId })
}

module.exports = {
    KeyToken1Repository,
    createToken,
    findByUserSlug,
    removeKeyById,
    findExistRefreshTokenUsed,
    findRefreshToken,
    deleteKeyByUserId,
    moveToSuspiciousToken
}