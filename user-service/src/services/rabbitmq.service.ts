import amqp from 'amqplib'

let channel: amqp.Channel

export const connectRabbitMQ = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!)
  channel = await conn.createChannel()
  await channel.assertQueue('user_created')
  await channel.assertQueue('user_deleted')
  console.log('✅ Connected to RabbitMQ')
}

export const publishEvent = (queue: string, data: unknown) => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized')
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
}
