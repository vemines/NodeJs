'use strict'

const model = require('../shop.model')

class ShopRepository {
    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }

    static findById = async ({ shop_id, projection, options }) => {
        return await model.findById(shop_id, projection, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}

const findByEmail = async (email) => {
    return await model.findOne({ usr_email: email }).lean()
}

const findById = async (id) => {
    return await model.findById(id)
}

const createShop = async (usr_name, usr_slug, usr_salt, usr_email, usr_password) => {

    return await model.create({
        usr_name: usr_name,
        usr_slug: usr_slug,
        usr_salt: usr_salt,
        usr_email: usr_email,
        usr_password: usr_password
    })
}

module.exports = {
    ShopRepository,
    createShop,
    findByEmail,
    findById
}