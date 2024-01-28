'use strict'

const shopModel = require('../shop.model')

const findByEmail = async (email) => {
    return await shopModel.findOne({ usr_email: email }).lean()
}

const findById = async (id) => {
    return await shopModel.findById(id)  // Use for get and update later so can't use lean()
}

const createShop = async (usr_name, usr_slug, usr_salt, usr_email, usr_password) => {
    return await shopModel.create({
        usr_name: usr_name,
        usr_slug: usr_slug,
        usr_salt: usr_salt,
        usr_email: usr_email,
        usr_password: usr_password
    })
}
const updateShopInfo = async () => { }
const disableShop = async (id) => { }
const changePassword = async (id, password) => { }

module.exports = {
    createShop,
    updateShopInfo,
    disableShop,
    changePassword,
    findByEmail,
    findById
}