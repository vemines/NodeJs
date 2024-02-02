const OrderService = require('../services/order.svc')
const { SuccessResponse } = require('../utils/success.response')


class CheckoutController {
    static handleOrderReview = async (req, res, next) => {
        return new SuccessResponse({
            metadata: await OrderService.orderReview({ payload: req.body })
        }).send(res)
    }
}


module.exports = CheckoutController