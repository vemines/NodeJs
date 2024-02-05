'use strict'

const { SuccessResponse, CreatedResponse } = require('../utils/success.response')
const UserService = require('../services/user.svc')

class UserController {
    static handleUpdateUserInfo = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Update user info Success',
            metadata: await UserService.updateUserInfo({
                usr_id: req.payload._id,
                payload: req.body
            }),
        }).send(res)
    }

    static handleCreateShop = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create shop Success',
            metadata: await UserService.createShopByUser({
                usr_id: req.payload._id
            }),
        }).send(res)
    }
}

module.exports = UserController