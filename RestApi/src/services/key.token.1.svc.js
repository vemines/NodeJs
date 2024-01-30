'use strict';

const { KeyToken1Repository, createToken, findByUserSlug, removeRefreshTokens, moveToSuspiciousToken } = require('../models/repositories/key.token.1.repo');
const SuspiciousRepository = require('../models/repositories/suspicious.repo')

class KeyTokenService {
    static createKeyToken = async ({
        usr_id, usr_slug, public_key, private_key, refresh_token
    }) => {
        const foundToken = await KeyToken1Repository.findOne({
            filter: { usr_slug }
        });

        if (!foundToken) {
            const payload = {
                usr_id: toObjectIdMongo(usr_id),
                usr_slug,
                refresh_token,
                public_key,
                private_key,
            }
            //   Create a new token if it doesn't exist
            KeyToken1Repository.create({ payload })
        }

        const update = { public_key, private_key, refresh_token };

        // if empty not change refresh_token_used
        if (foundToken.refresh_token !== "") {
            update.$addToSet = { refresh_tokens_used: foundToken.refresh_token };
        }
        const options = { upsert: true, new: true };;

        return await KeyToken1Repository.updateOne({
            filter: { usr_slug },
            update,
            options
        });
    }

    static clearRefreshToken = async ({ usr_slug }) => {
        const foundToken = await KeyToken1Repository.findOne({
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
        return await KeyToken1Repository.updateOne({
            filter: { usr_slug },
            update,
            options
        });
    }

    static processSusToken = async ({ usr_slug, refresh_token, access_token }) => {
        const foundToken = await KeyToken1Repository.findOne({
            filter: { usr_slug }
        });
        if (foundToken) {
            const payload = {
                access_token,
                usr_id: foundToken.usr_id,
                usr_slug: foundToken.usr_slug,
                public_key: foundToken.public_key,
                private_key: foundToken.private_key,
                refresh_token: foundToken.refresh_token,
            }
            await SuspiciousRepository.create({ payload })

            const update = { $pull: { refresh_tokens_used: refresh_token } }
            KeyToken1Repository.updateOne({
                filter: { usr_slug },
                update,
                options
            });
        }
    }
}

module.exports = KeyTokenService