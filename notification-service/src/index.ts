import amqp from 'amqplib'
import dotenv from 'dotenv'

dotenv.config()

async function start() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!)
    const channel = await conn.createChannel()
    await channel.assertQueue('user_created')
    await channel.assertQueue('user_deleted')

    console.log('✅ Notification Service connected to RabbitMQ')

    channel.consume('user_created', msg => {
      if (msg) {
        const content = msg.content.toString()
        console.log(`📩 Welcome notification: ${content}`)
        channel.ack(msg)
      }
    })

    channel.consume('user_deleted', msg => {
      if (msg) {
        const content = msg.content.toString()
        console.log(`📩 Deletion notification: ${content}`)
        channel.ack(msg)
      }
    })
  } catch (error) {
    console.error('❌ Error connecting to RabbitMQ:', error)
  }
}

start()
