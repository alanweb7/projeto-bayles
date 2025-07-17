// Importa a função de envio de mensagens e a biblioteca Bayles
const { sendMessage } = require('../../src/services/baylesService');
const Bayles = require('../lib/bayles'); // ou './lib/bayles' dependendo da estrutura

// Mocka a biblioteca Bayles para simular seu comportamento nos testes
jest.mock('../../src/services/baylesService');

describe('Bayles Service', () => {
  // Limpa mocks antes de cada teste
  beforeEach(() => {
    Bayles.mockClear();
  });

  // Teste: envio bem-sucedido da mensagem
  it('deve enviar uma mensagem com sucesso', async () => {
    // Cria um mock para o método sendToQueue que simula sucesso
    const mockSendToQueue = jest.fn().mockResolvedValue(true);

    // Mocka a instância da classe Bayles com o método simulado
    Bayles.mockImplementation(() => ({
      sendToQueue: mockSendToQueue,
    }));

    // Chama a função que será testada
    const result = await sendMessage('mensagens', { texto: 'olá' });

    // Verifica se o método foi chamado corretamente
    expect(mockSendToQueue).toHaveBeenCalledWith('mensagens', { texto: 'olá' });

    // Verifica se o retorno está correto
    expect(result).toEqual({ success: true });
  });

  // Teste: falha no envio da mensagem
  it('deve retornar erro ao falhar no envio', async () => {
    // Mocka o método sendToQueue para simular uma falha
    Bayles.mockImplementation(() => ({
      sendToQueue: jest.fn().mockRejectedValue(new Error('Erro de envio')),
    }));

    // Chama a função e espera a falha
    const result = await sendMessage('mensagens', { texto: 'erro' });

    // Verifica se o erro foi corretamente tratado
    expect(result.success).toBe(false);
    expect(result.error).toBe('Erro de envio');
  });
});
