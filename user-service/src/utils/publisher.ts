import amqplib from 'amqplib';
import logger from './logger';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
const EXCHANGE_NAME = 'user_events';

export const publishEvent = async (type: string, user: any) => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    const message = JSON.stringify({ type, user });

    channel.publish(EXCHANGE_NAME, '', Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    logger.error('RabbitMQ publish error:', error);
  }
};
