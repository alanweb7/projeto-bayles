// src/services/baileysService.js
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

let sock = null;

const authFolder = path.resolve(__dirname, '../../auth');

async function startBaileys() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true, // Mostra o QR diretamente no terminal
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.warn('Conexão encerrada com o WhatsApp');

        if (shouldReconnect) {
          logger.info('Tentando reconectar...');
          startBaileys();
        } else {
          logger.error('Sessão expirada. Deletando credenciais...');
          fs.rmSync(authFolder, { recursive: true, force: true });
        }
      }

      if (connection === 'open') {
        logger.info('✅ Conectado ao WhatsApp com sucesso!');
      }
    });

    sock.ev.on('creds.update', saveCreds);
  } catch (err) {
    logger.error('Erro ao iniciar o Baileys:', err);
  }
}

async function sendMessage(jid, text) {
  if (!sock) {
    logger.warn('Socket não iniciado. Iniciando agora...');
    await startBaileys();
  }

  try {
    await sock.sendMessage(jid, { text });
    logger.info(`Mensagem enviada para ${jid}: "${text}"`);
    return { success: true };
  } catch (error) {
    logger.error(`Erro ao enviar mensagem: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = {
  startBaileys,
  sendMessage
};
