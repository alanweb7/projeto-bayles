// src/services/baileysService.js
const path = require('path');

jest.mock('@whiskeysockets/baileys', () => {
  return {
    useSingleFileAuthState: jest.fn(() => ({
      state: {},
      saveState: jest.fn()
    })),
    // ... outros exports que usar
  };
});

const { useSingleFileAuthState } = require('@whiskeysockets/baileys');

const SESSION_FILE = path.resolve(__dirname, '../../session.json');
const { state, saveState } = useSingleFileAuthState(SESSION_FILE);

// agora use state e saveState normalmente nos testes
