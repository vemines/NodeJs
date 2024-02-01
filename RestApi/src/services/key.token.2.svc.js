'use strict';

const KeyToken2Repository = require('../models/repositories/key.token.2.repo');
const SuspiciousRepository = require('../models/repositories/suspicious.repo');

const { toObjectIdMongo } = require('../utils');

class KeyTokenService {
    static getTokenByUserSlug = async ({ usr_slug }) => {
        const foundToken = await KeyToken2Repository.findOne({
            filter: { usr_slug }
        });
        return foundToken
    }

    static createKeyToken = async ({ usr_id, usr_slug, public_key, refresh_token }) => {
        const foundToken = await KeyToken2Repository.findOne({
            filter: { usr_slug }
        });

        if (!foundToken) {
            const payload = {
                usr_id: usr_id,
                usr_slug,
                refresh_token,
                public_key,
            }
            //   Create a new token if it doesn't exist
            KeyToken2Repository.create({ payload })
        }

        const update = { public_key, refresh_token };

        // if empty not change refresh_token_used
        if (!!foundToken.refresh_token) {
            update.$addToSet = { refresh_tokens_used: foundToken.refresh_token };
        }
        const options = { upsert: true, new: true };;

        return await KeyToken2Repository.updateOne({
            filter: { usr_slug },
            update,
            options
        });
    }

    static clearRefreshToken = async ({ usr_slug }) => {
        const foundToken = await KeyToken2Repository.findOne({
            filter: { usr_slug }
        });
        if (!foundToken) {
            throw new UnAuthorizedError('Invalid Request')
        }
        const update = {
            $addToSet: { refresh_tokens_used: foundToken.refresh_token },
            $set: { refresh_token: "" }
        };
        const options = { upsert: true, new: true };;
        return await KeyToken2Repository.updateOne({
            filter: { usr_slug },
            update,
            options
        });
    }

    static processSusToken = async ({ usr_slug, refresh_token, access_token }) => {
        const foundToken = await KeyToken2Repository.findOne({
            filter: { usr_slug }
        });
        if (foundToken) {
            const payload = {
                access_token,
                usr_id: foundToken.usr_id,
                usr_slug: foundToken.usr_slug,
                public_key: foundToken.public_key,
                refresh_token: foundToken.refresh_token,
            }
            await SuspiciousRepository.create({ payload })

            const update = { $pull: { refresh_tokens_used: refresh_token } }
            const options = { upsert: true, new: true }
            KeyToken2Repository.updateOne({
                filter: { usr_slug },
                update,
                options
            });
        }
    }
}

module.exports = KeyTokenService