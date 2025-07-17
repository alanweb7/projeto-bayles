/**
 * Este módulo define uma função receiveMessagesFromQueue que se conecta ao RabbitMQ, 
 * escuta uma fila específica e coleta mensagens até atingir um número limite ou um 
 * tempo máximo definido. Ele faz a leitura manual das mensagens (modo pull), 
 * processa o conteúdo de cada uma e marca como recebida (ack). 
 * O retorno é uma lista de mensagens lidas com a data/hora de recebimento. 
 * Ideal para processamentos por lote com controle de quantidade e timeout.
 */

// Importa a função que conecta ao RabbitMQ, localizada em ../config/rabbitmq
const { connectRabbitMQ } = require('../config/rabbitmq');

/**
 * Função responsável por consumir mensagens de uma fila do RabbitMQ.
 * @param {string} queue - Nome da fila que será lida.
 * @param {number} limit - Número máximo de mensagens a serem lidas.
 * @param {number} timeoutInSeconds - Tempo limite (em segundos) para aguardar novas mensagens.
 */
async function receiveMessagesFromQueue(queue, limit, timeoutInSeconds) {
  // Conecta ao RabbitMQ e obtém o canal de comunicação
  const channel = await connectRabbitMQ();

  // Garante que a fila existe (ou cria se não existir) com durabilidade habilitada
  await channel.assertQueue(queue, { durable: true });

  // Lista onde as mensagens lidas serão armazenadas
  const messages = [];
  // Marca o início do tempo para controle de timeout
  const startTime = Date.now();

  // Enquanto não atingir o limite de mensagens e o tempo não exceder
  while (messages.length < limit && (Date.now() - startTime) < timeoutInSeconds * 1000) {
    // Tenta obter uma mensagem da fila (modo manual, sem auto-confirmação)
    const msg = await channel.get(queue, { noAck: false });

    if (msg) {
      // Converte o conteúdo da mensagem para objeto JSON
      const content = JSON.parse(msg.content.toString());

      // Adiciona a mensagem no array com a data/hora de recebimento
      messages.push({
        ...content,
        receivedAt: new Date().toISOString()
      });

      // Envia ack (confirmação) para o RabbitMQ de que a mensagem foi processada
      channel.ack(msg);
    } else {
      // Se não houver mensagem, espera 200ms antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Retorna todas as mensagens que foram recebidas dentro do limite e tempo
  return messages;
}

// Exporta a função para ser utilizada em outros arquivos
module.exports = {
  receiveMessagesFromQueue
};
