'use strict'

const { promisify } = require('util')
const redis = require('redis')
const redisClient = redis.createClient()
redisClient.connect()

const InventoryService = require('./inventory.svc')

class RedisService {
    static acquireLockOrder = async ({ prod_id, shop_id, quantity }) => {
        const key = `lock_2024_${prod_id}`
        const retryTimes = 10
        const expireTime = 20 // 20s

        for (let i = 0; i < retryTimes; i++) {
            const options = {
                NX: true,
                EX: expireTime,
            };
            const result = await redisClient.set(key, "", options);
            if (result === 'OK') {
                const isReservation = await InventoryService.reservationInventory({
                    prod_id, shop_id, quantity
                })
                // if reservation success
                if (isReservation.modifiedCount > 0) {
                    return key
                }
                // if false return null for tell user check because product in cart because out of quantity
                return null
            } else {
                await new Promise(resolve => setTimeout(resolve, 50))
            }
        }
    }


    static releaseLockOrder = async keyLock => {
        return await redisClient.del(keyLock);
    }
}

module.exports = RedisService