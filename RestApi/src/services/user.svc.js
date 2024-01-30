'use strict';

const { UserRepository,
    createUser,
    findByEmail,
    findById,
    createShop,
    updateUser } = require('../models/repositories/user.repo');
const { ShopRepository } = require('../models/repositories/shop.repo');
const { randomString, updateNestedObjectParser, removeUndefinedObject } = require('../utils');

class UserService {
    static findUserByEmail = async ({ email }) => {
        const filter = { usr_email: email }
        return await UserRepository.findOne({ filter })
    }
    static findUserById = async ({ usr_id }) => {
        return await UserRepository.findById({ usr_id })
    }

    static createUser = async ({
        usr_name, usr_slug, usr_salt, usr_email, usr_password
    }) => {
        const payload = { usr_name, usr_slug, usr_salt, usr_email, usr_password }
        return await UserRepository.create({ payload })
    }

    static createShopByUser = async ({ usr_id }) => {
        const foundUser = await UserRepository.findById({ usr_id })
        // Not found user
        if (!foundUser)
            throw new NotFoundError('User not found')
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
        const shop_slug = randomString()
        const payload = {
            shop_avatar: foundUser.usr_avatar,
            usr_slug: foundUser.usr_slug,
            shop_slug: shop_slug,
            shop_name: shop_slug,
            shop_address_city: foundUser.usr_address_city,
            shop_address: foundUser.usr_address,
            shop_email: foundUser.email,
            shop_phone: foundUser.usr_phone,
        }
        return await ShopRepository.create(payload)
    }

    static updateUserInfo = async ({ usr_id, payload }) => {
        // body like { usr_id: usr_id} and may not contains all updateFields
        const updateFields = {
            usr_name, usr_email, usr_phone, usr_sex,
            usr_address, usr_address_city, usr_avatar, usr_date_of_birth
        } = payload

        const update = updateNestedObjectParser(removeUndefinedObject(updateFields))
        return await UserRepository.findByIdAndUpdate({ usr_id, update })
    }
}

module.exports = UserService