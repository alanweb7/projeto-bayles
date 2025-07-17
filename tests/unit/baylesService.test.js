// tests/unit/baylesService.test.js

const { sendMessage, startBaileys } = require('../../src/services/baylesService');

jest.mock('@whiskeysockets/baileys', () => ({
  useSingleFileAuthState: jest.fn(() => ({
    state: {},
    saveState: jest.fn()
  })),
  default: jest.fn(() => ({
    ev: {
      on: jest.fn()
    },
    sendMessage: jest.fn()
  })),
  DisconnectReason: {
    loggedOut: 'loggedOut'
  }
}));

describe('Baileys Service', () => {
  it('deve iniciar sem lançar erro', () => {
    expect(() => startBaileys()).not.toThrow();
  });
});
