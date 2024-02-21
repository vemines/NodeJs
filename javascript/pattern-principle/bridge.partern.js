

// define Payment Process
class PaymentProcess {
    pay(amount) {

    }
}
// define VisaPayment Process class
class VisaPaymentProcess extends PaymentProcess {
    constructor(cardNumber, expiryDate, cvv) {
        super()
        this.cardNumber = cardNumber
        this.expiryDate = expiryDate
        this.cvv = cvv
    }
    //implements the pay method
    pay(amount) {
        console.log(`paying ${amount} USD with visa card ${this.cardNumber}...`)
        // TODO: Implement logic...
    }
}
// define MomoPayment Process
class MomoPaymentProcess extends PaymentProcess {
    constructor(phoneNumber) {
        super()
        this.phoneNumber = phoneNumber
    }
    //implements the pay method
    pay(amount) {
        console.log(`paying ${amount} VND with momo card ${this.phoneNumber}...`)
        // TODO: Implement logic...
    }
}

// define MemverRegistration 
class MemberRegistration {
    constructor(paymentProcessor) {
        this.paymentProcessor = paymentProcessor
    }
    //regis
    register() {
        const amount = 100; // the registration fee in USD 
        this.paymentProcessor.pay(amount)
        console.log(`Registered for Youtube membership!`)
    }
}
// Creata visa payment
const visaPaymentProcessor = new VisaPaymentProcess('1234.3456.xxx', '12/25', '123')
const membershipVisa = new MemberRegistration(visaPaymentProcessor)
membershipVisa.register()

// create momo payment
const momoPaymentProcessor = new MomoPaymentProcess('09090909090')
const membershipMomo = new MemberRegistration(momoPaymentProcessor)
membershipMomo.register()