const { connectRabbitMQ } = require('../config/rabbitmq');

async function sendToQueue(queue, message) {
  try {
    const channel = await connectRabbitMQ();

    await channel.assertQueue(queue, { durable: true });
    const msgBuffer = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(queue, msgBuffer, { persistent: true });

    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem para a fila:', error);
    throw error;
  }
}

module.exports = { sendToQueue };
