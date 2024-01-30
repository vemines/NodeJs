'use strict'

const { SuccessResponse } = require('../utils/success.response')
const CartService = require('../services/cart.svc')

class CartController {
    handleAddToCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Add to cart success',
            metadata: await CartService.addToCart({
                usr_id: req.usr_id,
                // "product": {"prod_id" ,"shop_id": ,"quantity": }
                product: req.body.product
            })
        }).send(res)
    }

    handleUpdateCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Update cart Success',
            metadata: await CartService.updateCart({
                usr_id: req.usr_id,
                // 'shop_order_ids': { 'products' : { 'quantity': ,'price': ,'shop_id': ,'old_quantity': ,'prod_id': ,} 'version', }
                shop_order_id: req.shop_order_id
            })
        }).send(res)
    }

    handleRemoveProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Delete product in cart Success',
            metadata: await CartService.deleteUserCart({
                usr_id: req.usr_id,
                prod_id: req.body.prod_id
            })
        }).send(res)
    }

    handleGetListCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get cart Success',
            metadata: await CartService.getListUserCart({
                usr_id: req.query.usr_id
            })
        }).send(res)
    }

    handleClearCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get cart Success',
            metadata: await CartService.clearUserCart({
                usr_id: req.query.usr_id
            })
        }).send(res)
    }
}

module.exports = CartController