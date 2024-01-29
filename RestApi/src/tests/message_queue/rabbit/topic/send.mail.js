const amqp = require('amqplib')

const runSendMail = async () => {
    try {
        // create connect and channel
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        // create exchange
        const nameExchange = 'send-email'
        await channel.assertExchange(nameExchange, 'topic', {
            durable: false
        })

        const args = process.argv.slice(2)
        const message = args[1] || 'test-msg'
        const topic = args[0]
        console.log(` message :: ${message}::::::::::: topic::${topic}`)

        // publish email
        channel.publish(nameExchange, topic, Buffer.from(message))    // '' generate queue name
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

runSendMail()