const redis = require('../config/redis');

const ID_EXPIRATION_SECONDS = 60 * 60 * 24; // 24 horas

async function isUniqueId(id) {
  const exists = await redis.exists(`msgid:${id}`);
  return !exists;
}

async function markIdAsUsed(id) {
  await redis.setEx(`msgid:${id}`, ID_EXPIRATION_SECONDS, '1');
}

module.exports = { isUniqueId, markIdAsUsed };
