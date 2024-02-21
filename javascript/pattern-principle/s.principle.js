class Order {
    constructor(userId) {
        this.userId = userId
        this.timeOrder = Date.now()
        this.products = []
    }
}

class OrderManager {
    constructor() {
        this.order = null
    }

    // createOrder
    createOrder(userId) {
        this.order = new Order(userId)
        return this.order;
    }

    // addProduct
    addProduct(product) {
        this.order.products.push(product)
    }

    // get Order
    getOrder() {
        return this.order
    }

    // !! is negative of negative (because array.length is not bool)
    isValid() {
        return !!this.order.products.length
    }

    //sendMail
    sendOrder() {
        if (this.isValid()) {
            // sendmail shouldn't write code here
            // await fetch('https://ecommerce.com/api/orders')
            // console.log('SendMAIL TO https://ecommerce.com/api/orders success::', this.order)

            this.orderSendMail = new SendMailOrder()
            return this.orderSendMail.sendMail(this.order)
        }
    }
}
class SendMailorder {
    sendMail(order) {
        console.log(`SendMAIL TO https://aliconcon.com/api/orders success::`, order)
        return 1    // success
    }
}


const orderManager = new OrderManager();
orderManager.createOrder('userId-10001')
orderManager.addProduct({ productId: 101, quantity: 2, price: 1000, unit: 'USD' })
orderManager.addProduct({ productId: 102, quantity: 3, price: 2000, unit: 'USD' })
console.log(`Order Info:::`, orderManager.getOrder())