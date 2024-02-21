class MomoPaymentAdapter {
    constructor(momoPayment) {
        this.momoPayment = momoPayment
    }

    //define the payWithVisa method that is required by the youtbe registration process 
    payWithVisa(visaPayment) {
        //convert the momo to visa
        const convertedPayment = this.convertToVisaPayment(this.momoPayment) //make the payment using the Visa
        visaPayment.pay(convertedPayment)
        //define the convertToVisaPayment method 
    }

    convertToVisaPayment(momoPayment) {
        //convert the momo to a visa
        const conversionRate = 23000 // 1 USD = 23.000 VND 
        const visaAmount = momoPayment.amount / conversionRate
        const visaPayment = {
            cardNumber: momoPayment.cardNumber,
            expiryDate: momoPayment.expiryDate,
            cvv: momoPayment.cvv,
            amount: visaAmount
        }
        return visaPayment
    }
}

// define the VisaPayment 
class VisaPayment {
    pay(payment) {
        console.log(`Paying ${payment.amount} USD with Visa card ${payment.cardNumber}...`)
        // TODO: payment processing logic...
    }
}

// define the MomoPayment
class MomoPayment {
    constructor(cardNumber, expiryDate, cvv, visaAmount) {
        this.cardNumber = cardNumber
        this.expiryDate = expiryDate
        this.cvv = cvv
        this.amount = visaAmount
    }
}
// create a momo
const momoPayment = new MomoPayment('123456789', '12/25', '123', 230000)

// Create a momo-to-visa adapter
const momoAdapter = new MomoPaymentAdapter(momoPayment)

// Create a Visa Payment
const visaPayment = new VisaPayment()

//Register for Youtube
momoAdapter.payWithVisa(visaPayment)