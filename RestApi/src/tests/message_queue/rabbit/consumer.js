const amqp = require('amqplib')


const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()
        const queueName = 'test-rabbit'
        await channel.assertQueue(queueName, {
            durable: true
        })


        channel.consume(queueName, (message) => {
            console.log('received message::::', message.content.toString())
        }, {
            noAck: true
        })

    }
    catch (err) {
        console.log(err)
    }

}

runConsumer()