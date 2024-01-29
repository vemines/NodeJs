const amqp = require("amqplib")

const runOrderedConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost")
        const channel = await connection.createChannel()

        const queueName = "order-queued-message"

        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.prefetch(1)     // set prefetch to 1 for ensure only 1 ack at time

        channel.consume(queueName, msg => {
            const message = msg.content.toString()

            setTimeout(() => {
                console.log(`process ${message}`)
                channel.ack(msg)

            }, Math.random() * 1000);
        })

    }
    catch (err) {
        console.log(err)
    }
}

runOrderedConsumer().catch(console.error)