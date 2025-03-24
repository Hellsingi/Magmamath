import express from 'express';
import amqp from 'amqplib/callback_api';

const app = express();

app.use(express.json());

const startServer = () => {
  amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      channel.assertQueue('user_created', { durable: false });
      channel.assertQueue('user_deleted', { durable: false });

      channel.consume('user_created', (msg) => {
        if (msg !== null) {
          console.log('User Created:', msg.content.toString());
          channel.ack(msg);
        }
      });

      channel.consume('user_deleted', (msg) => {
        if (msg !== null) {
          console.log('User Deleted:', msg.content.toString());
          channel.ack(msg);
        }
      });
    });
  });

  app.listen(3001, () => {
    console.log('Notification Service is running on port 3001');
  });
};

startServer();