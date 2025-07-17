// tests/unit/baylesService.test.js

const { sendMessage, startBaileys } = require('../../src/services/baylesService');

jest.mock('@whiskeysockets/baileys', () => ({
  useMultiFileAuthState: jest.fn(() => ({
    state: {},
    saveCreds: jest.fn()
  })),
  fetchLatestBaileysVersion: jest.fn(() => ({
    version: [2, 2323, 4],
    isLatest: true
  })),
  makeWASocket: jest.fn(() => ({
    ev: {
      on: jest.fn(),
    },
    waitForConnectionUpdate: jest.fn(),
    ws: { close: jest.fn() },
    sendMessage: jest.fn(),
  }))
}));



describe('Baileys Service', () => {
  it('deve iniciar sem lançar erro', () => {
    expect(() => startBaileys()).not.toThrow();
  });
});
