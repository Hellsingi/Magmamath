import amqplib from "amqplib";
import dotenv from "dotenv";
import logger from "./utils/logger";
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE_NAME = "user_events";

export async function consumeMessages() {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: false });

    const { queue } = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue, EXCHANGE_NAME, "");

    logger.info("📥 Waiting for messages from RabbitMQ...");

    channel.consume(
      queue,
      (msg) => {
        if (msg?.content) {
          const content = JSON.parse(msg.content.toString());

          if (content.type === "USER_CREATED") {
            logger.info(
              `🎉 Welcome new user: ${content.user.name} (${content.user.email})`
            );
          } else if (content.type === "USER_DELETED") {
            logger.warn(
              `⚠️ User deleted: ${content.user.name} (${content.user.email})`
            );
          }
        }
      },
      { noAck: true }
    );
  } catch (err) {
    logger.error('Consume messages error: %s', err);
    setTimeout(consumeMessages, 5000);
  }
}
