'use strict'

const { SuccessResponse } = require('../utils/success.response')

const dataProfiles = [
    { usr_id: 1, usr_name: 'user_1', usr_avt: 'image.com/user/1' },
    { usr_id: 2, usr_name: 'user_2', usr_avt: 'image.com/user/2' },
    { usr_id: 3, usr_name: 'user_3', usr_avt: 'image.com/user/3' }
]

class ProfileController {
    // admin
    allProfiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'view all profiles',
            metadata: dataProfiles
        }).send(res)
    }

    // shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'view all profiles',
            metadata: dataProfiles[1]

        }).send(res)
    }
}

module.exports = new ProfileController();