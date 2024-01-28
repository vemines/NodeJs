'use strict';

const userRepo = require('../models/repositories/user.repo');
class UserService {
    static findUserByEmail = async (email) => {
        return await userRepo.findByEmail(email)
    }
    static findUserById = async ({ _id }) => {
        return await userRepo.findById(_id)
    }

    static createUser = async ({ usr_name, usr_slug, usr_salt, usr_email, usr_password }) => {
        return await userRepo.createUser(usr_name, usr_slug, usr_salt, usr_email, usr_password)
    }

    static createShopByUser = async (payload) => {
        return await userRepo.createShop(payload)
    }
    static updateUserInfo = async (_id, bodyUpdate) => {
        return await userRepo.updateUser(_id, bodyUpdate)
    }
}

module.exports = UserService