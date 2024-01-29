const amqp = require('amqplib')

const runReceiveMail = async () => {
    try {
        // create connect and channel
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        // create exchange
        const nameExchange = 'send-email'
        await channel.assertExchange(nameExchange, 'topic', {
            durable: false
        })

        // create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true
        })

        const args = process.argv.slice(2)
        if (!args.length) {
            process.exit(0)
        }

        console.log(` waiting queue :: ${queue}::::::::::: topic::${args}`)

        args.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key)
        })

        // receive mail
        await channel.consume(queue, msg => {
            console.log(`Routing key: ${msg.fields.routingKey} ::: message: ${msg.content.toString()}`)
        })


    }
    catch (err) {
        console.log(err)
    }
}

runReceiveMail()