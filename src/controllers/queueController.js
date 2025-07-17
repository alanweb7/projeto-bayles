const { connectRabbitMQ } = require('../config/rabbitmq');

async function getQueuesStatus(queueNames = []) {
  const channel = await connectRabbitMQ();

  // Tratamento de erro do canal (evita que derrube o processo)
  channel.on('error', (err) => {
    console.error('Erro no canal RabbitMQ:', err.message);
  });

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
      // Mesmo com erro, continua verificando outras filas
      console.warn(`Erro ao verificar a fila '${name}':`, error.message);
      queueStatuses.push({
        name,
        messageCount: 0,
        consumerCount: 0,
        isActive: false,
        error: 'Fila não encontrada ou erro ao verificar'
      });

      // Aqui recria o canal para evitar canal quebrado
      channel = await connectRabbitMQ();
    }
  }

  return {
    success: true,
    queues: queueStatuses,
    rabbitMQStatus: 'connected',
    timestamp: new Date().toISOString()
  };
}

module.exports = { getQueuesStatus };
