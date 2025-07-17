const { isUniqueId, markIdAsUsed } = require('../services/idService');
const { sendToQueue } = require('../services/rabbitMQService');
const { v4: uuidv4 } = require('uuid');

async function sendMessage(req, res) {
  try {
    const { queue, message } = req.body;

    let messageId = message.id;

    if (!messageId) {
      messageId = await generateUniqueMessageId(isUniqueId);
      message.id = messageId;
    } else {
      const unique = await isUniqueId(message.id);
      if (!unique) {
        return res.status(409).json({ success: false, error: 'ID da mensagem já foi usado' });
      }
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


async function generateUniqueMessageId(isUniqueFn) {
  let newId;
  let attempts = 0;

  do {
    newId = uuidv4(); // ou use outro método de geração
    attempts++;
    // Proteção contra loop infinito
    if (attempts > 10) {
      throw new Error('Falha ao gerar um ID único após 10 tentativas');
    }
  } while (!(await isUniqueFn(newId)));

  return newId;
}


module.exports = {
  sendMessage
};
