'use strict'

const userModel = require('../user.model')
const shopModel = require('../shop.model')
const { NotFoundError, InternalServerError, BadRequestError } = require('../../utils/error.response')
const { toObjectIdMongo, randomString } = require('../../utils')

const findByEmail = async (email) => {
    return await userModel.findOne({ usr_email: email }).lean()
}

const findById = async (_id) => {
    return await userModel.findById(_id)  // Use for get and update later so can't use lean()
}

const createShop = async (payload) => {
    const currentUser = await findById(payload._id)
    if (!currentUser) {
        throw new NotFoundError('User not found')
    }
    // check user avatar, phone 
    if (!currentUser.usr_avatar || !currentUser.usr_phone || !currentUser.usr_address || !currentUser.usr_address_city) {
        throw new BadRequestError('User information is invalid, please add avatar, phone and address')
    }

    if (currentUser.usr_is_seller) {
        throw new BadRequestError('User already create shop')
    }

    var newShop = await shopModel.create({
        shop_avatar: currentUser.usr_avatar,
        usr_slug: payload.usr_slug,
        shop_slug: randomString(),
        shop_name: randomString(),
        shop_address_city: currentUser.usr_address_city,
        shop_address: currentUser.usr_address,
        shop_email: payload.email,
        shop_phone: currentUser.usr_phone,
    })

    if (!newShop) {
        throw new InternalServerError('Fail to create shop')
    }


    await userModel.findByIdAndUpdate(
        { _id: payload._id, },
        {
            usr_is_seller: true,
            usr_shop_id: toObjectIdMongo(newShop._id)
        },
        { new: true }
    )

    return newShop;
}

const createUser = async (usr_name, usr_slug, usr_salt, usr_email, usr_password) => {
    return await userModel.create({
        usr_name: usr_name,
        usr_slug: usr_slug,
        usr_salt: usr_salt,
        usr_email: usr_email,
        usr_password: usr_password
    })
}

const updateUser = async (_id, bodyUpdate) => {
    return await userModel.findByIdAndUpdate(_id, bodyUpdate, { new: true })
}
const disableUser = async (id) => { }
const changePassword = async (id, password) => { }

module.exports = {
    createUser,
    findByEmail,
    findById,
    createShop,
    updateUser
}