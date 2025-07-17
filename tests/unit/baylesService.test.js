// Importa a função de envio de mensagens do serviço
const { sendMessage } = require('../../src/services/baylesService');

// Mocka a biblioteca @whiskeysockets/baileys (se estiver usando em baylesService)
jest.mock('@whiskeysockets/baileys', () => ({
  default: jest.fn(),
}));

describe('Bayles Service', () => {
  let mockSendToQueue;

  beforeEach(() => {
    // Cria novo mock para cada teste
    mockSendToQueue = jest.fn();

    // Mocka a função `makeWASocket` que retorna um "socket" com `sendToQueue`
    const makeWASocket = require('@whiskeysockets/baileys').default;
    makeWASocket.mockReturnValue({
      sendToQueue: mockSendToQueue,
    });
  });

  it('deve enviar uma mensagem com sucesso', async () => {
    // Simula sucesso
    mockSendToQueue.mockResolvedValue(true);

    const result = await sendMessage('mensagens', { texto: 'olá' });

    expect(mockSendToQueue).toHaveBeenCalledWith('mensagens', { texto: 'olá' });
    expect(result).toEqual({ success: true });
  });

  it('deve retornar erro ao falhar no envio', async () => {
    // Simula falha
    mockSendToQueue.mockRejectedValue(new Error('Erro de envio'));

    const result = await sendMessage('mensagens', { texto: 'erro' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Erro de envio');
  });
});
