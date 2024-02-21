class FifaOnlinePlayer {
    constructor(name, team, position, goals) {
        this.name = name
        this.team = team
        this.position = position
        this.goals = goals
    }

    score() {
        this.goals++
    }

    clone() {
        return new FifaOnlinePlayer(this.name, this.team, this.position, this.goals)
    }
}


FifaOnlinePlayer.prototype.stats = {
    minutesPlayed: 0
}

// Create a new FifaOnlinePlayer prototype
const prototypePattern = new FifaOnlinePlayer('CR7', 'Al Nassr', 'FW', 0)

// create multiple instance of the fifaonline plauyer 
const cr7 = prototypePattern.clone()
cr7.stats.minutesPlayed = 1000      // the stats effect m10 object too. Fix: search shadow/deep copy 

const m10 = prototypePattern.clone()
m10.name = 'Messi'
m10.team = 'PSG'

// test the instance
cr7.score()
console.log(`${cr7.name} has recored ${cr7.goals} this season. stats:::${JSON.stringify(cr7.stats)}`)
m10.score()
console.log(`${m10.name} has recored ${m10.goals} this season. stats:::${JSON.stringify(m10.stats)}`)