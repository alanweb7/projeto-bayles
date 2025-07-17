// controllers/queueController.js
const { connectRabbitMQ } = require('../config/rabbitmq');

async function queueStatus(req, res) {
  const channel = await connectRabbitMQ();

  channel.on('error', (err) => {
    console.error('Erro no canal RabbitMQ:', err.message);
  });

  const queueNames = ['fila_exemplo']; // <- pode parametrizar depois
  const queueStatuses = [];

  for (const name of queueNames) {
    try {
      const { messageCount, consumerCount } = await channel.checkQueue(name);

      queueStatuses.push({
        name,
        messageCount,
        consumerCount,
        isActive: consumerCount > 0 || messageCount > 0
      });
    } catch (error) {
      console.warn(`Erro ao verificar a fila '${name}':`, error.message);
      queueStatuses.push({
        name,
        messageCount: 0,
        consumerCount: 0,
        isActive: false,
        error: 'Fila não encontrada ou erro ao verificar'
      });
    }
  }

  return res.json({
    success: true,
    queues: queueStatuses,
    rabbitMQStatus: 'connected',
    timestamp: new Date().toISOString()
  });
}

module.exports = { queueStatus };
