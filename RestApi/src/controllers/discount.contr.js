'use strict'

const DiscountService = require('../services/discount.svc')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')


class DiscountController {
    static handleCreateDiscountCode = async (req, res, next) => {
        new CreatedResponse({
            message: "Create discount success",
            metadata: await DiscountService.createDiscountCode({
                payload: {
                    ...req.body,
                    shop_id: req.shop_id
                }
            })
        }).send(res)
    }

    static handleGetAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            metadata: await DiscountService.getAllDiscountCodesByShop({
                shop_id: req.shop_id
            })
        }).send(res)
    }

    static handleGetDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: "Get discount amount success",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    static handleGetAllProductsForDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: "Get product of discount",
            metadata: await DiscountService.getAllProductsForDiscountCode({ ...req.query })
        }).send(res)
    }


}


module.exports = DiscountController