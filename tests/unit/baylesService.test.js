const { sendMessage } = require('../../src/services/baylesService');
const Bayles = require('bayles');

jest.mock('bayles');

describe('Bayles Service', () => {
  beforeEach(() => {
    Bayles.mockClear();
  });

  it('deve enviar uma mensagem com sucesso', async () => {
    const mockSendToQueue = jest.fn().mockResolvedValue(true);
    Bayles.mockImplementation(() => ({
      sendToQueue: mockSendToQueue,
    }));

    const result = await sendMessage('mensagens', { texto: 'olá' });

    expect(mockSendToQueue).toHaveBeenCalledWith('mensagens', { texto: 'olá' });
    expect(result).toEqual({ success: true });
  });

  it('deve retornar erro ao falhar no envio', async () => {
    Bayles.mockImplementation(() => ({
      sendToQueue: jest.fn().mockRejectedValue(new Error('Erro de envio')),
    }));

    const result = await sendMessage('mensagens', { texto: 'erro' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Erro de envio');
  });
});
