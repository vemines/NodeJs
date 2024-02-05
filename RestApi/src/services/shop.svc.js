'use strict'

const ShopRepository = require('../models/repositories/shop.repo');
const { toObjectIdMongo } = require('../utils');
const { BadRequestError } = require('../utils/error.response');

class ShopService {
    static findShopById = async ({ shop_id }) => {
        const foundShop = await ShopRepository.findById({ id: shop_id })
        if (!foundShop) throw new BadRequestError('Shop not found')
        return foundShop;
    }
    // "shop_avatar", "usr_slug" , "shop_slug", "shop_name" (init of shop_name = shop_slug), 
    // "shop_address_city", "shop_address", "shop_email", "shop_phone"
    static createShop = async ({ payload }) => {
        return await ShopRepository.create({ payload })
    }

    static subcribeShop = async ({ usr_id, shop_id }) => {
        const filter = {
            _id: toObjectIdMongo(shop_id),
            shop_subscribers: { $elemMatch: { usr_id: toObjectIdMongo(usr_id) } }
        }
        const isSubscribed = await ShopRepository.find({ filter });
        console.log(isSubscribed);
        if (isSubscribed.length > 0) {
            throw new BadRequestError('Already subcribe shop')
        }
        const update = {
            $addToSet: {
                shop_subscribers: { usr_id: toObjectIdMongo(usr_id) }
            }
        }
        const options = { new: true }
        return await ShopRepository.findByIdAndUpdate({ id: shop_id, update, options })
    }

    static unSubcribeShop = async ({ usr_id, shop_id }) => {
        const filter = {
            _id: toObjectIdMongo(shop_id),
            shop_subscribers: { $elemMatch: { usr_id: toObjectIdMongo(usr_id) } }
        }
        const isSubscribed = await ShopRepository.find({ filter });
        console.log(isSubscribed);
        if (isSubscribed.length == 0) {
            throw new BadRequestError('Not subcribe shop')
        }
        const update = {
            $pull: {
                shop_subscribers: { usr_id: toObjectIdMongo(usr_id) }
            }
        }
        const options = { new: true }
        return await ShopRepository.findByIdAndUpdate({ id: shop_id, update, options })
    }

    static addBuyer = async ({ usr_id, shop_id }) => {
        const shop = await ShopRepository.findById({ id: shop_id });
        const buyer = shop.shop_buyer.find(b => b.usr_id.toString() === usr_id.toString());

        if (buyer) {
            // If the buyer exists, increase the orders count
            buyer.orders += 1;
        } else {
            // If the buyer does not exist, create a new buyer
            shop.shop_buyer.push({ usr_id, orders: 1 });
        }
        // Save the changes
        return await shop.save();
    }
}
module.exports = ShopService