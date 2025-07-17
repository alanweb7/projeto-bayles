// tests/unit/baylesService.test.js

const { sendMessage, startBaileys } = require('../../src/services/baylesService');

jest.mock('@whiskeysockets/baileys', () => ({
  useMultiFileAuthState: jest.fn(() => ({
    state: {},
    saveCreds: jest.fn()
  })),
  makeWASocket: jest.fn(() => ({
    ev: { on: jest.fn() },
    sendMessage: jest.fn(),
    logout: jest.fn()
  }))
}));


describe('Baileys Service', () => {
  it('deve iniciar sem lançar erro', () => {
    expect(() => startBaileys()).not.toThrow();
  });
});
