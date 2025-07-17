/**
 * Esse módulo é responsável por garantir que uma mensagem formatada 
 * corretamente seja enviada de forma segura e persistente para uma fila 
 * RabbitMQ específica. Ele utiliza a conexão reaproveitada do módulo connectRabbitMQ.
 */




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


/**
 * Função que retorna o status de várias filas do RabbitMQ.
 * @param {Array} queueNames - Lista com os nomes das filas a serem verificadas.
 * @returns {Object} - Objeto com o status de cada fila e da conexão.
 */
async function getQueuesStatus(queueNames = []) {
  // Estabelece conexão com o canal do RabbitMQ
  const channel = await connectRabbitMQ();

  // Array para armazenar o status de cada fila
  const queueStatuses = [];

  // Percorre cada nome de fila informado
  for (const name of queueNames) {
    try {
      // Usa checkQueue para obter informações da fila (como mensagens e consumidores)
      const { messageCount, consumerCount } = await channel.checkQueue(name);

      // Adiciona o status da fila ao array
      queueStatuses.push({
        name,
        messageCount,
        consumerCount,
        isActive: consumerCount > 0 || messageCount > 0 // Fila ativa se tiver mensagens ou consumidores
      });
    } catch (error) {
      // Em caso de erro (por exemplo, fila inexistente), adiciona um status padrão
      queueStatuses.push({
        name,
        messageCount: 0,
        consumerCount: 0,
        isActive: false,
        error: 'Fila não encontrada ou erro ao verificar'
      });
    }
  }

  // Retorna o resultado final contendo os status das filas, status do RabbitMQ e timestamp
  return {
    success: true,
    queues: queueStatuses,
    rabbitMQStatus: 'connected',
    timestamp: new Date().toISOString()
  };
}

// Exporta a função para ser usada em outros arquivos
module.exports = { getQueuesStatus };
