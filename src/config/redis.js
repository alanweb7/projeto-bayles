const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', err => console.error('Erro no Redis:', err));
redis.on('connect', () => console.log('Redis conectado'));

(async () => {
  await redis.connect();
})();

module.exports = redis;
