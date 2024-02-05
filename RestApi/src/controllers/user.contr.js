'use strict'

const { SuccessResponse, CreatedResponse } = require('../utils/success.response')
const UserService = require('../services/user.svc')

class UserController {
    static handleGetNotifys = async (req, res, next) => {
        new CreatedResponse({
            message: 'Get notifys Success',
            metadata: await UserService.getNotifys({
                usr_id: req.payload._id,
            }),
        }).send(res)
    }

    static handleSubcribeShop = async (req, res, next) => {
        new CreatedResponse({
            message: 'Subcribe shop Success',
            metadata: await UserService.subcribeShop({
                usr_id: req.payload._id,
                shop_id: req.body.shop_id,
            }),
        }).send(res)
    }

    static handleUnSubcribeShop = async (req, res, next) => {
        new CreatedResponse({
            message: 'UnSubcribe shop Success',
            metadata: await UserService.unSubcriberShop({
                usr_id: req.payload._id,
                shop_id: req.body.shop_id,
            }),
        }).send(res)
    }
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