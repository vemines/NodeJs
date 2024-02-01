'use strict'

const ShopRepository = require('../models/repositories/shop.repo');

class ShopService {
    static findShopById = async ({ shop_id }) => {
        return ShopRepository.findById({ shop_id })
    }
    // "shop_avatar", "usr_slug" , "shop_slug", "shop_name" (init of shop_name = shop_slug), 
    // "shop_address_city", "shop_address", "shop_email", "shop_phone"
    static createShop = async ({ payload }) => {
        return ShopRepository.create({ payload })
    }
}
module.exports = ShopService