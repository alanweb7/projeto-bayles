// controllers/queueController.js
const { connectRabbitMQ } = require('../config/rabbitmq');

// Função auxiliar para buscar todas as filas disponíveis no RabbitMQ
async function listAllQueues(channel) {
  const response = await channel.connection.request({
    // Requisição interna ao RabbitMQ via método HTTP AMQP (requires management plugin)
    method: 'GET',
    path: '/api/queues',
  });

  return response.map((q) => q.name);
}

async function queueStatus(req, res) {
  let channel;
  try {
    channel = await connectRabbitMQ();

    channel.on('error', (err) => {
      console.error('Erro no canal RabbitMQ:', err.message);
    });

    // Pega os nomes via query string: ?queues=fila1,fila2,fila3
    let queueNames = [];

    if (req.query.queues) {
      queueNames = req.query.queues.split(',');
    } else {
      // Caso não seja informado, usa um fallback de filas padrão OU lista todas (se estiver usando o plugin de gerenciamento)
      queueNames = ['mensagens']; // ou: await listAllQueues(channel);
    }

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
  } catch (error) {
    console.error('Erro geral ao buscar status das filas:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao conectar ou processar status das filas',
    });
  }
}

module.exports = { queueStatus };
