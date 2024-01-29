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

        // publish message
        channel.publish(nameExchange, '', Buffer.from(message))    // '' generate queue name

        console.log(`Send message success:: ${message}`)

        // close connect after 2s
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 2000);
    }
    catch (err) {
        console.log(err)
    }
}

const message = 'Hello exchange'
runProducer({ message })