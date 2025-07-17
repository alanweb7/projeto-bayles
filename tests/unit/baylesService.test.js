// tests/unit/baylesService.test.js

const { sendMessage, startBaileys } = require('../../src/services/baylesService');

jest.mock('@whiskeysockets/baileys', () => ({
  useMultiFileAuthState: jest.fn(() => ({
    state: {},
    saveCreds: jest.fn()
  })),
  fetchLatestBaileysVersion: jest.fn(() => ({
    version: [2, 2323, 4], // qualquer versão dummy
    isLatest: true
  })),
  default: {
    makeWASocket: jest.fn(() => ({
      ev: {
        on: jest.fn(),
      },
      waitForConnectionUpdate: jest.fn(),
      ws: { close: jest.fn() },
    }))
  }
}));



describe('Baileys Service', () => {
  it('deve iniciar sem lançar erro', () => {
    expect(() => startBaileys()).not.toThrow();
  });
});
