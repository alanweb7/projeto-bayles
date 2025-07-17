const { Connection } = require('../../src/services/baylesService');
const makeWaSocket = require('@whiskeysockets/baileys').default;

jest.mock('@whiskeysockets/baileys', () => {
  return {
    __esModule: true,
    default: jest.fn(), // mockando makeWaSocket como função
  };
});

describe('Baileys Service', () => {
  it('deve iniciar sem lançar erro', async () => {
    const fakeSocket = { user: { id: '1234' } };
    makeWaSocket.mockReturnValue(fakeSocket);

    const sock = await Connection();

    expect(sock).toBe(fakeSocket);
    expect(makeWaSocket).toHaveBeenCalledTimes(1);
  });
});
