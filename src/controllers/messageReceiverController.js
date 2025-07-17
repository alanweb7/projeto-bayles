/**
 * Esse controller é responsável por expor uma rota HTTP (geralmente GET) 
 * que permite ler mensagens de uma fila do RabbitMQ, com suporte a limite e timeout, 
 * ideal para depuração ou processamento manual.
 */

// Importa a função de serviço responsável por consumir mensagens do RabbitMQ
const { receiveMessagesFromQueue } = require('../services/rabbitMQReceiverService');

// Define a função assíncrona que será usada como controller para a rota de recebimento de mensagens
async function receiveMessages(req, res) {
  // Obtém o nome da fila a partir dos parâmetros da URL (ex: /api/queue/:queueName)
  const queue = req.params.queueName;

  // Converte o parâmetro de limite (limit) da query string em número. Default: 10 mensagens
  const limit = parseInt(req.query.limit, 10) || 10;

  // Converte o parâmetro de timeout da query string em número de segundos. Default: 5 segundos
  const timeout = parseInt(req.query.timeout, 10) || 5;

  try {
    // Chama o serviço que consome as mensagens da fila com os parâmetros fornecidos
    const messages = await receiveMessagesFromQueue(queue, limit, timeout);

    // Retorna uma resposta JSON com sucesso, mensagens recebidas, nome da fila e total de mensagens
    return res.status(200).json({
      success: true,
      messages,
      queueName: queue,
      totalReceived: messages.length
    });
  } catch (error) {
    // Em caso de erro, loga no console e retorna erro 500 com mensagem genérica
    console.error('Erro ao receber mensagens:', error);
    return res.status(500).json({ success: false, error: 'Erro ao consumir mensagens da fila' });
  }
}

// Exporta o controller para ser utilizado nas rotas
module.exports = {
  receiveMessages
};
