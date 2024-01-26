'use strict'

const userModel = require('../user.model')

const findByEmail = async (email) => {
    return await userModel.findOne({ usr_email: email }).lean()
}

const findById = async (id) => {
    return await userModel.findById(id)  // Use for get and update later so can't use lean()
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
const updateUserInfo = async () => { }
const disableUser = async (id) => { }
const changePassword = async (id, password) => { }

module.exports = {
    createUser,
    updateUserInfo,
    disableUser,
    changePassword,
    findByEmail,
    findById
}