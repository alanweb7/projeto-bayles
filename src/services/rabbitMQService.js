/**
 * Esse módulo é responsável por garantir que uma mensagem formatada 
 * corretamente seja enviada de forma segura e persistente para uma fila 
 * RabbitMQ específica. Ele utiliza a conexão reaproveitada do módulo connectRabbitMQ.
 */

// Importa a função que conecta ao RabbitMQ a partir do módulo de configuração
const { connectRabbitMQ } = require('../config/rabbitmq');


// Função assíncrona que envia uma mensagem para uma fila específica do RabbitMQ
async function sendToQueue(queue, message) {
  try {
    // Estabelece (ou reutiliza) uma conexão com o canal do RabbitMQ
    const channel = await connectRabbitMQ();

    // Garante que a fila exista. Se não existir, ela será criada com durabilidade (resistente a reinícios)
    await channel.assertQueue(queue, { durable: true });

    // Converte o objeto de mensagem em uma string JSON e depois em buffer (formato binário)
    const msgBuffer = Buffer.from(JSON.stringify(message));

    // Envia a mensagem para a fila especificada. A opção `persistent: true` garante que a mensagem será salva em disco
    channel.sendToQueue(queue, msgBuffer, { persistent: true });

    // Retorna `true` indicando que a mensagem foi enviada com sucesso
    return true;
  } catch (error) {
    // Em caso de erro, exibe no console e lança o erro para ser tratado por quem chamou essa função
    console.error('Erro ao enviar mensagem para a fila:', error);
    throw error;
  }
}

// Exporta a função `sendToQueue` para ser utilizada em outras partes do sistema
module.exports = { sendToQueue };
