const amqp = require('amqplib')

const runProducer = async ({ message }) => {
    try {
        // create connect and channel
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        // create exchange
        const nameExchange = 'exchange-test'
        await channel.assertExchange(nameExchange, 'fanout', {
            durable: false
        })

        // create queue
        const {
            queue // name queue
        } = await channel.assertQueue('', {
            exclusive: true    // will remove after close (for save connection)
        })
        console.log(`nameQueue::: ${queue}`)

        // binding queue and receive message
        await channel.bindQueue(queue, nameExchange, '')
        await channel.consume(queue, msg => {
            console.log('msg::', msg.content.toString())
        }, {
            noAck: true
        })
    }
    catch (err) {
        console.log(err)
    }
}

const message = 'Hello exchange'
runProducer({ message })