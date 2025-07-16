const { sendToQueue } = require('../services/rabbitMQService');

async function sendMessage(req, res) {
  try {
    const { queue, message } = req.body;

    await sendToQueue(queue, message);

    return res.status(200).json({
      success: true,
      messageId: message.id,
      queueName: queue,
      timestamp: message.timestamp
    });
  } catch (error) {
    console.error('Erro no sendMessage:', error);
    return res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
}

module.exports = { sendMessage };
