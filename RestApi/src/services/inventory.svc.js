'use strict'

const ProductService = require('./product.svc')
const InventoryRepository = require('../models/repositories/inventory.repo')

const { BadRequestError } = require('../utils/error.response')

class InventoryService {
    static createInventory = async ({ payload }) => {
        return await InventoryRepository.create({ payload })
    }

    static reservationInventory = async ({ prod_id, shop_id, quantity, cart_id }) => {
        await ProductService.checkProductExist({
            prod_id
        })
        const filter = {
            inven_prod_id: convertToObjectIdMongo(prod_id),
            inven_stock: { $gte: quantity }
        }
        const update = {
            $inc: { inven_stock: -quantity },
            $push: {
                inven_reservations: {
                    prod_id,
                    quantity,
                    cart_id,
                    createAt: new Date()
                }
            }
        }
        const options = { upsert: true, new: true }

        return await InventoryRepository.updateOne({ query: filter, update, options })
    }

    static removeReservation = async ({ prod_id, shop_id, quantity, cart_id }) => {
        await ProductService.checkProductExist({
            prod_id
        })

        const filter = {
            inven_prod_id: convertToObjectIdMongo(prod_id),
            inven_stock: { $gte: quantity }
        }
        const update = {
            $inc: { inven_stock: quantity },
            $pull: {
                inven_reservations: {
                    prod_id,
                    quantity,
                    cart_id
                }
            }
        }
        const options = { upsert: true, new: true }

        return await InventoryRepository.updateOne({ query: filter, update, options })
    }

    static addStockToInventory = async ({
        stock, prod_id, shop_id, inven_address, inven_address_city
    }) => {
        await ProductService.checkProductExist({
            filter: { prod_id }
        })

        const filter = { inven_shop_id: shop_id, inven_prod_id: prod_id }
        const update = {
            $inc: { inven_stock: stock },
            $set: { inven_address, inven_address_city }
        }
        const options = { new: true }

        return await InventoryRepository.findOneAndUpdate({ filter, update, options })
    }
}


module.exports = InventoryService