// tests/unit/baileysService.test.js

const P = require('pino');

jest.mock('@whiskeysockets/baileys', () => {
  return {
    default: jest.fn(() => ({
      ev: {
        on: jest.fn((event, cb) => {
          if (event === 'connection.update') {
            // Simula a emissão do QR code
            setTimeout(() => {
              cb({ qr: 'FAKE_QR_CODE_STRING', connection: 'open' });
            }, 10);
          }
        }),
      },
    })),
    useMultiFileAuthState: jest.fn(async () => ({
      state: {},
      saveCreds: jest.fn(),
    })),
    fetchLatestBaileysVersion: jest.fn(async () => ({ version: [2, 2204, 13] })),
    DisconnectReason: {
      loggedOut: 401,
    },
  };
});

const logger = require('../../src/utils/logger');
const { startBaileys } = require('../../src/services/baileysService');

describe('Baileys QR Code', () => {
  it('deve gerar QR code no terminal', async () => {
    const logSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});

    await startBaileys();

    await new Promise((resolve) => setTimeout(resolve, 50));

    // Debug opcional:
    console.log('Calls:', logSpy.mock.calls);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('QR Code gerado'));

    logSpy.mockRestore();
  });
});
