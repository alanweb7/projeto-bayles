/**
 * Essa função é a controladora principal de envio de mensagens. Ela:
 * Garante que o ID da mensagem seja único;
 * Envia para a fila desejada via RabbitMQ;
 * Registra o ID no Redis para evitar reenvios duplicados;
 * Retorna uma resposta JSON clara.
 */

// Importa funções de controle de ID único, usadas para garantir que uma mensagem não seja duplicada
const { isUniqueId, markIdAsUsed } = require('../services/idService');

// Importa a função responsável por enviar a mensagem para uma fila RabbitMQ
const { sendToQueue } = require('../services/rabbitMQService');

/**
 * Função assíncrona que recebe uma requisição HTTP e processa o envio da mensagem para a fila.
 * Responsável por validar ID, enviar para a fila e registrar o uso do ID no Redis.
 */
async function sendMessage(req, res) {
  try {
    // Extrai o nome da fila e o objeto da mensagem do corpo da requisição (JSON enviado pelo cliente)
    const { queue, message } = req.body;

    // Verifica se o ID da mensagem já foi usado (garante unicidade usando Redis)
    const unique = await isUniqueId(message.id);
    if (!unique) {
      // Caso o ID já tenha sido usado, retorna erro 409 (conflito)
      return res.status(409).json({ success: false, error: 'ID da mensagem já foi usado' });
    }

    // Envia a mensagem para a fila especificada
    await sendToQueue(queue, message);

    // Marca o ID como usado no Redis, evitando reutilização por 24 horas
    await markIdAsUsed(message.id);

    // Retorna uma resposta de sucesso com informações úteis
    return res.status(200).json({
      success: true,
      messageId: message.id,
      queueName: queue,
      timestamp: message.timestamp
    });
  } catch (error) {
    // Em caso de erro inesperado, registra no console e retorna erro 500 (servidor)
    console.error('Erro no sendMessage:', error);
    return res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
}

// Exporta a função sendMessage para uso em rotas ou controladores externos
module.exports = {
  sendMessage
};
