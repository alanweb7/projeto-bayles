// src/services/baileysService.js
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { unlinkSync } = require('fs');
const { Boom } = require('@hapi/boom');
const path = require('path');

const logger = require('../utils/logger'); // Certifique-se de que esse logger exista

const SESSION_FILE = path.resolve(__dirname, '../../session.json');
const { state, saveState } = useSingleFileAuthState(SESSION_FILE);

let sock;

function startBaileys() {
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Mostra QR no terminal
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      logger.info('QR Code gerado, escaneie com o WhatsApp!');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        logger.warn('Conexão fechada, tentando reconectar...');
        startBaileys();
      } else {
        logger.error('Desconectado permanentemente. Limpando sessão...');
        try {
          unlinkSync(SESSION_FILE);
        } catch (e) {
          logger.error('Erro ao remover sessão:', e);
        }
      }
    }

    if (connection === 'open') {
      logger.info('✅ Conectado ao WhatsApp com sucesso!');
    }
  });

  sock.ev.on('creds.update', saveState);
}

// Envia uma mensagem para um número
async function sendMessage(jid, message) {
  try {
    if (!sock) throw new Error('Cliente Baileys não inicializado');
    await sock.sendMessage(jid, message);
    return { success: true };
  } catch (error) {
    logger.error('Erro ao enviar mensagem:', error);
    return { success: false, error: error.message || error };
  }
}

module.exports = {
  startBaileys,
  sendMessage,
};
