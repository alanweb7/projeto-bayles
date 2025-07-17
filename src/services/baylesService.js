const makeWaSocket = require('@whiskeysockets/baileys').default;

async function Connection() {
  const sock = makeWaSocket({ /* configs */ });
  return sock;
}

module.exports = {
  Connection,
};
