const amqp = require("amqplib")

const runOrderedProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:guest@localhost")
        const channel = await connection.createChannel()

        const queueName = "order-queued-message"

        await channel.assertQueue(queueName, {
            durable: true
        })


        for (let i = 0; i < 10; i++) {
            const message = `ordered-queued-message:::${i}`
            console.log(`message: ${message}`)

            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            })
        }

        setTimeout(() => {
            connection.close()
        }, 2000);

    }
    catch (err) {
        console.log(err)
    }

}

runOrderedProducer().catch(console.error)