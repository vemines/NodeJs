'use strict';

const UserRepository = require('../models/repositories/user.repo');
const ShopRepository = require('../models/repositories/shop.repo');

const { randomString, updateNestedObjectParser, getFieldsNotUndefinedFromObject } = require('../utils');
const { BadRequestError, NotFoundError } = require('../utils/error.response');
const { toObjectIdMongo } = require('../utils')

class UserService {
    static findUserByEmail = async ({ email }) => {
        const filter = { usr_email: email }
        return await UserRepository.findOne({ filter })
    }
    static findUserById = async ({ usr_id }) => {
        const foundUser = await UserRepository.findById({ id: usr_id })
        if (!foundUser) throw new NotFoundError('Not found User')
        return foundUser
    }

    static createUser = async ({
        usr_name, usr_slug, usr_salt, usr_email, usr_password
    }) => {
        const payload = { usr_name, usr_slug, usr_salt, usr_email, usr_password }
        return await UserRepository.create({ payload })
    }

    static createShopByUser = async ({ usr_id }) => {
        const foundUser = await UserRepository.findById({ id: usr_id })
        // Not found user
        if (!foundUser) throw new NotFoundError('User not found')
        // foundUser must have usr_avatar, usr_phone, usr_address, usr_address_city
        if (!foundUser.usr_avatar ||
            !foundUser.usr_phone ||
            !foundUser.usr_address ||
            !foundUser.usr_address_city)
            throw new BadRequestError('User information is invalid, please add avatar, phone and address')
        // foundUser is not seller
        if (foundUser.usr_is_seller)
            throw new BadRequestError('User already create shop')

        // create shop
        const shopSlug = randomString()
        const payload = {
            shop_avatar: foundUser.usr_avatar,
            usr_slug: foundUser.usr_slug,
            shop_slug: shopSlug,
            shop_name: shopSlug,
            shop_address_city: foundUser.usr_address_city,
            shop_address: foundUser.usr_address,
            shop_email: foundUser.usr_email,
            shop_phone: foundUser.usr_phone,
        }
        const newShop = await ShopRepository.create({ payload })

        if (!newShop) {
            throw new InternalServerError('Fail to create shop')
        }

        await UserRepository.findByIdAndUpdate({
            usr_id,
            update: {
                usr_is_seller: true,
                usr_shop_id: toObjectIdMongo(newShop._id)
            },
            options: { new: true }
        })

        return newShop
    }

    static updateUserInfo = async ({ usr_id, payload }) => {
        // payload is { usr_id: usr_id } and may not contains all updateFields
        const updateFields = [
            "usr_name", "usr_email", "usr_phone", "usr_sex",
            "usr_address", "usr_address_city", "usr_avatar", "usr_date_of_birth"
        ]
        const update = updateNestedObjectParser(getFieldsNotUndefinedFromObject({
            object: payload,
            fields: updateFields
        }))
        const options = { upsert: true, new: true };

        return await UserRepository.findByIdAndUpdate({ usr_id, update, options })
    }
}

module.exports = UserService