'use strict'

const NotifyRepository = require('../models/repositories/notify.repo')
const { getSelectData, toObjectIdMongo } = require('../utils')

class NotifyService {
    static getUserNotifys = async ({ usr_id, limit = 50, page = 1 }) => {
        const skip = (page - 1) * limit
        const filter = {
            noti_received_id: usr_id
        }

        return NotifyRepository.find({ filter, limit, skip })
    }

    static pushNotifyByShop = async ({
        type = 'SHOP-001', received_usr_ids = [], sender_id, noti_content = '', options = {}
    }) => {
        const payload = received_usr_ids.map(received_usr_id => ({
            noti_type: type,
            noti_content,
            noti_received_id: toObjectIdMongo(received_usr_id.usr_id),
            noti_sender_id: toObjectIdMongo(sender_id),
            noti_options: options
        }));

        const newNotis = await NotifyRepository.insertMany({ payload });
        return newNotis;
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