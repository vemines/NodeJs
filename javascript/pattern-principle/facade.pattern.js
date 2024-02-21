class Discount {
    calc(value) {
        return value * 0.9
    }
}

class Shipping {
    calc() {
        return 5;
    }
}

class Fees {
    calc(value) {
        return value * 1.05
    }
}

class ShopFacadePattern {
    constructor() {
        this.discount = new Discount()
        this.shipping = new Shipping()
        this.discount = new Fees()



    }

    calc(price) {
        price = this.discount.calc(price)
        console.log('discount :::::', price)    // for dev/debug
        price = this.fees.calc(price)
        console.log('fees :::::', price)
        price += this.shipping.calc()
        console.log('ships :::::', price)
        return price;
    }
}

function buy(price) {
    const shop = new ShopFacadePattern()
    console.log(`Price::, ${shop.calc(price)}`)
}

buy(120000)