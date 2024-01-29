const amqp = require('amqplib')
const message = 'hello rabbit'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-rabbit'

        await channel.assertQueue(queueName, {
            durable: true   // if server restart queue still keep queueName
        })

        channel.sendToQueue(queueName, Buffer.from(message), {
            expiration: '10000', // TTL 10 seconds
            persistent: true,   // save queue at cache or disk (use with durable for avoid lost message when restart server)
        })

        setTimeout(() => {
            connection.close()
        }, 1000);
    }
    catch (err) {
        console.log(err)
    }
}

runProducer()