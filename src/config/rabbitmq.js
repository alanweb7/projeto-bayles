const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
  if (channel) return channel;

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ conectado');
    return channel;
  } catch (error) {
    console.error('Erro ao conectar no RabbitMQ:', error);
    throw error;
  }
}

module.exports = { connectRabbitMQ };
