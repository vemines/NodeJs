'use strict'

const { SuccessResponse } = require('../utils/success.response')
const CartService = require('../services/cart.svc')

class CartController {
    handleAddToCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    handleUpdateCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Update cart Success',
            metadata: await CartService.updateCart(req.body)
        }).send(res)
    }

    handleDeleteProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Delete product in cart Success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    handleGetListCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get cart Success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }

    handleClearCart = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get cart Success',
            metadata: await CartService.clearUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()