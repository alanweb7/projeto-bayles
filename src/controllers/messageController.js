const { isUniqueId, markIdAsUsed } = require('../services/idService');
const { sendToQueue } = require('../services/rabbitMQService');

async function sendMessage(req, res) {
  try {
    const { queue, message } = req.body;

    const unique = await isUniqueId(message.id);
    if (!unique) {
      return res.status(409).json({ success: false, error: 'ID da mensagem já foi usado' });
    }

    await sendToQueue(queue, message);
    await markIdAsUsed(message.id);

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
