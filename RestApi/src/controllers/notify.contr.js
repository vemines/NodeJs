

const NotificationService = require('../services/notify.svc')
const { SuccessResponse } = require('../utils/success.response')

class NotificationController {
    handleGetListNotiByUser = async (req, res, next) => {
        return new SuccessResponse({
            metadata: await NotificationService.listNotifyByUser({ usr_slug: req.payload.usr_slug })
        }).send(res)
    }

    handleReadNotifyByUser = async (req, res, next) => {
        return new SuccessResponse({
            metadata: await NotificationService.readNotifyByUser({
                usr_id: req.payload.usr_slug,
                notify_id: req.params.notify_id
            })
        }).send(res)
    }
}
module.exports = new NotificationController()