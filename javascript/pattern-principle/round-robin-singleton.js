class RoundRobin {
    constructor() {
        if (RoundRobin.instance) {
            return RoundRobin.instance
        }
        RoundRobin.instance = this
        this.servers = []
        this.index = 0
    }
    //add server
    addServer(server) {
        this.servers.push(server)
    }

    // get next server
    getNextServer() {
        if (!this.servers.length) {
            throw new Error('No server available!')
        }

        const server = this.servers[this.index]
        // modulus
        this.index(this.index + 1) % this.servers.length
        return server
    }
}
const loadBalancer = new RoundRobin()
const loadBalancer1 = new RoundRobin()

// check sinleton
console.log('compare::', loadBalancer === loadBalancer1)

// test
loadBalancer.addServer('Server 01')
loadBalancer.addServer('Server 02')
loadBalancer.addServer('Server 03')

console.log(loadBalancer.getNextServer()) // Server 01
console.log(loadBalancer.getNextServer()) // 02
console.log(loadBalancer.getNextServer()) // 03
console.log(loadBalancer.getNextServer()) // 01
console.log(loadBalancer.getNextServer()) // 02

