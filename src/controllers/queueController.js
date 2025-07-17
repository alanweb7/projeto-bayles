const { getQueuesStatus } = require('../services/rabbitMQService');

// Defina aqui as filas que você quer monitorar
const FILAS_MONITORADAS = [
  'fila_exemplo',
  'outra_fila_importante'
];

async function queueStatus(req, res) {
  try {
    const status = await getQueuesStatus(FILAS_MONITORADAS);
    return res.status(200).json(status);
  } catch (error) {
    console.error('Erro ao obter status das filas:', error);
    return res.status(500).json({
      success: false,
      error: 'Falha ao obter status das filas',
      rabbitMQStatus: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { queueStatus };
