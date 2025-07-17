// tests/unit/baylesService.test.js

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

const { startBaileys } = require('../../src/services/baylesService');

describe('Baileys QR Code', () => {
  it('deve gerar QR code no terminal', async () => {
    // Mock console.log para capturar a saída
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await startBaileys();

    // Dá um tempo para o setTimeout interno disparar
    await new Promise((r) => setTimeout(r, 20));

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('QR code'));

    logSpy.mockRestore();
  });
});
