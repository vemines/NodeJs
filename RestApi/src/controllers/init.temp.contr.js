'use strict'

const InitTempService = require('../services/init.temp.svc')

class InitTempController {
    static functionName = async (req, res, next) => {
        new SuccessRequest({
            message: 'Action Name Success',
            metadata: await InitTempService.findById(
                req.body.id
            ),
            // metadata: await InitTempService.findById(
            // {
            //     refreshToken: req.refreshToken,
            //     user: req.user,
            // }),
        }).send(res)
    }
}

module.exports = InitTempController