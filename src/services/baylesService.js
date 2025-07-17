// src/services/baylesService.js
const Bayles = require('bayles');
const logger = require('../utils/logger');

const baylesConfig = {
  connection: {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT, 10) || 5672,
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/'
  },
  queues: {
    defaultExchange: 'direct',
    prefetch: 10,
    durable: true
  }
};

let baylesClient;

function initBaylesClient() {
  try {
    baylesClient = new Bayles(baylesConfig);

    baylesClient.on('connected', () => logger.info('Bayles conectado ao RabbitMQ.'));
    baylesClient.on('error', (err) => logger.error('Erro no Bayles:', err));
    baylesClient.on('disconnected', () => logger.warn('Bayles desconectado do RabbitMQ.'));
  } catch (error) {
    logger.error('Erro ao inicializar o cliente Bayles:', error);
    throw error;
  }
}

async function sendMessage(queue, message) {
  if (!baylesClient) {
    logger.warn('Bayles não estava inicializado. Inicializando...');
    initBaylesClient();
  }

  try {
    await baylesClient.sendToQueue(queue, message);
    logger.info({ event: 'MensagemEnviada', fila: queue, conteudo: message });
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

module.exports = {
  initBaylesClient,
  sendMessage
};
