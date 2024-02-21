class Leader {
    receiveRequest(offer) {
        console.log(`Received offer success:::${offer}`)
    }
}
class Secretary {
    constructor() {
        this.leader = new Leader()
    }

    receiveRequest(offer) {
        // some login process offer

        //
        this.leader.receiveRequest(offer)
    }
}

class Developer {
    constructor(offer) {
        this.offer = offer
    }

    applyFor(target) {
        target.receiveRequest(this.offer)
    }
}


const devs = new Developer('offer increse salary')
devs.applyFor(new Secretary())