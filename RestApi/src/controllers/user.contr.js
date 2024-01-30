'use strict'

const { SuccessResponse } = require('../utils/success.response')
const UserService = require('../services/user.svc')

class UserController {
    static handleUpdateUserInfo = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update user info Success',
            metadata: await UserService.updateUserInfo({
                usr_id: req.payload._id,
                payload: req.body
            }),
        }).send(res)
    }
}

module.exports = UserController