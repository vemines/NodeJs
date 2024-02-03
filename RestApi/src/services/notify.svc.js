'use strict'

const NotifyRepository = require('../models/repositories/notify.repo')
const { getSelectData } = require('../utils')

class NotifyService {
    static pushNotifyByShop = async ({
        type = 'SHOP-001', received_id, sender_id, noti_content = '', options = {}
    }) => {
        const payload = {
            noti_type: type,
            noti_content,
            noti_received_id: received_id,
            noti_sender_id: sender_id,
            noti_options: options
        }
        const newNoti = await NotifyRepository.create({
            payload
        })
        return newNoti
    }

    static listNotifyByUser = async ({ usr_slug }) => {
        const filter = {
            noti_received_id: usr_slug,
        }
        const projection = getSelectData([
            "_id",
            "noti_type",
            "noti_sender_id",
            "noti_received_id",
            "noti_content",
            "noti_options",
            "createdAt"
        ])
        return await NotifyRepository.find({
            filter, projection
        })
    }

    static readNotifyByUser = async ({ usr_slug, notify_id }) => {
        const filter = {
            _id: notify_id,
            noti_received_id: usr_slug
        }
        const update = { $set: { noti_status: true } }
        const options = { new: true }

        return await NotifyRepository.findOneAndUpdate({
            filter, update, options
        })
    }
}

module.exports = NotifyService