import amqplib from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

async function listenForMessages() {
  const conn = await amqplib.connect(process.env.RABBITMQ_URL!);
  const channel = await conn.createChannel();

  const exchange = 'user_events';
  await channel.assertExchange(exchange, 'fanout');

  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, exchange, '');

  console.log("Listening for user events...");

  channel.consume(q.queue, (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      if (content.type === 'USER_CREATED') {
        console.log(`Welcome ${content.user.name}!`);
      } else if (content.type === 'USER_DELETED') {
        console.log(`User deleted: ${content.user.name}`);
      }
    }
  }, { noAck: true });
}

listenForMessages().catch(console.error);
