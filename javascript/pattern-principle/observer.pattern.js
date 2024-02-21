class Observer {
    constructor(name) { // sniper, riki
        this.namePick = name;
    }

    updateStatus(location) {
        this.goToHelp(location)
    }

    goToHelp(location) {
        console.log(`${this.namePick}:::: PING:::: ${JSON.stringify(location)}`)
    }
}

class Subject {
    constructor() {
        // list receive update
        this.observerList = []
    }

    addObserver(observer) {
        this.observerList.push(observer)
    }

    ping(location) {
        this.observerList.forEach(observer => observer.updateStatus(location))
    }
}

const subject = new Subject()

// your teams
const heroA = new Observer('heroA')
const heroB = new Observer('heroB')
const heroC = new Observer('heroC')

// add menbers to Team 
subject.addObserver(heroA)
subject.addObserver(heroB)
subject.addObserver(heroC)

// push location to Team
subject.notify({ long: 123, lat: 345 })