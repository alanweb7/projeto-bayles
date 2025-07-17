// src/services/baylesService.js
// Importa a biblioteca Bayles (cliente para RabbitMQ) e o logger personalizado
// const Bayles = require('bayles');
const Bayles = require('@whiskeysockets/baileys');

const logger = require('../utils/logger');

// Configuração do cliente Bayles com dados de conexão ao RabbitMQ
const baylesConfig = {
  connection: {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT, 10) || 5672,
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/'
  },
  queues: {
    defaultExchange: 'direct', // tipo de exchange
    prefetch: 10,              // número máximo de mensagens simultâneas
    durable: true              // mantém a fila mesmo após reinício do RabbitMQ
  }
};

let baylesClient; // Variável global que armazenará o cliente Bayles

// Inicializa o cliente Bayles e define handlers de evento
function initBaylesClient() {
  try {
    baylesClient = new Bayles(baylesConfig);

    baylesClient.on('connected', () =>
      logger.info('Bayles conectado ao RabbitMQ.')
    );

    baylesClient.on('error', (err) =>
      logger.error('Erro no Bayles:', err)
    );

    baylesClient.on('disconnected', () =>
      logger.warn('Bayles desconectado do RabbitMQ.')
    );
  } catch (error) {
    logger.error('Erro ao inicializar o cliente Bayles:', error);
    throw error;
  }
}

// Envia uma mensagem para uma fila RabbitMQ usando o Bayles
async function sendMessage(queue, message) {
  // Garante que o cliente esteja inicializado
  if (!baylesClient) {
    logger.warn('Bayles não estava inicializado. Inicializando...');
    initBaylesClient();
  }

  try {
    await baylesClient.sendToQueue(queue, message); // Envia para a fila
    logger.info({
      event: 'MensagemEnviada',
      fila: queue,
      conteudo: message
    });
  } catch (error) {
    logger.error({
      event: 'ErroEnvioMensagem',
      fila: queue,
      conteudo: message,
      erro: error.message || error
    });
    throw error;
  }
}

// Exporta as funções para uso externo
module.exports = {
  initBaylesClient,
  sendMessage
};
