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
      printQRInTerminal: true, // Mostra QR no terminal
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info('QR Code gerado. Escaneie com o WhatsApp para conectar.');
        logger.info(qr);
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        logger.warn(`Conexão fechada com statusCode=${statusCode}`);

        if (shouldReconnect) {
          logger.info('Tentando reconectar...');
          await startBaileys(); // aguarda para evitar chamadas infinitas simultâneas
        } else {
          logger.error('Sessão desconectada permanentemente. Deletando credenciais...');
          try {
            fs.rmSync(authFolder, { recursive: true, force: true });
          } catch (err) {
            logger.error('Erro ao deletar credenciais:', err);
          }
          sock = null;
        }
      }

      if (connection === 'open') {
        logger.info('✅ Conectado ao WhatsApp com sucesso!');
      }
    });

    sock.ev.on('creds.update', saveCreds);

    return sock; // opcionalmente retorna o socket criado

  } catch (err) {
    logger.error('Erro ao iniciar o Baileys:', err);
    throw err; // opcional, para saber que falhou
  }
}

async function sendMessage(jid, text) {
  try {
    if (!sock) {
      logger.warn('Socket não iniciado. Iniciando agora...');
      await startBaileys();
    }

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
