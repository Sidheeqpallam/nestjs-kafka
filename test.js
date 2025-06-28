const { Kafka } = require('kafkajs')
const ip = require('ip')
const host = process.env.HOST_IP || ip.address()
console.log(host, ' host address')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`${host}:9092`]
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'consumer-group-id' })

const run = async () => {
  try {
    // Connect producer
    await producer.connect()
    console.log('Producer connected')

    // Send message
    await producer.send({
      topic: 'test-server',
      messages: [
        {
          value: "hi there"
        }
      ]
    })
    console.log('Message sent successfully')

    // Connect consumer
    await consumer.connect()
    console.log('Consumer connected')

    // Subscribe to topic
    await consumer.subscribe({ topic: 'test-server', fromBeginning: true })
    console.log('Subscribed to topic: test-server')

    // Run consumer
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
          timestamp: message.timestamp,
          headers: message.headers,
        })

        // Process your message here
        const messageValue = message.value.toString()
        console.log(`Processing message: ${messageValue}`)

        // Add your business logic here
        // For example: save to database, call API, etc.
      },
    })
  } catch (error) {
    console.error('Error in Kafka operation:', error)
  }
}

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down...')
  try {
    await producer.disconnect()
    await consumer.disconnect()
    console.log('Kafka connections closed')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

// Listen for shutdown signals
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

run().catch(console.error)