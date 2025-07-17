/**
 * Esse código configura e conecta o Redis com 
 * suporte para URL de ambiente e mensagens de 
 * log de sucesso/erro. Ele também exporta o cliente 
 * Redis já conectado, pronto para uso em outros módulos da sua aplicação.
 */

// Importa a função createClient do pacote 'redis' para criar um cliente Redis
const { createClient } = require('redis');

// Cria uma instância do cliente Redis, definindo a URL a partir da variável de ambiente
// ou usando a URL local padrão (redis://localhost:6379)
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Adiciona um listener para capturar e exibir erros de conexão ou operação com o Redis
redis.on('error', err => console.error('Erro no Redis:', err));

// Adiciona um listener para exibir uma mensagem no console quando a conexão for bem-sucedida
redis.on('connect', () => console.log('Redis conectado'));

// IIFE (função assíncrona autoexecutável) que se conecta ao Redis ao iniciar o app
(async () => {
  await redis.connect();
})();

// Exporta a instância do Redis para ser utilizada em outros arquivos da aplicação
module.exports = redis;
