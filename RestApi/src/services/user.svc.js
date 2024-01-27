'use strict';

const userRepo = require('../models/repositories/user.repo')
class UserService {
    static findUserByEmail = async (email) => {
        return await userRepo.findByEmail(email)
    }

    static createUser = async ({ usr_name, usr_slug, usr_salt, usr_email, usr_password }) => {
        return await userRepo.createUser(usr_name, usr_slug, usr_salt, usr_email, usr_password)
    }
}

module.exports = UserService