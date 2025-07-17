/**
 * Esse módulo se conecta ao RabbitMQ uma única vez e retorna um 
 * canal reutilizável para evitar múltiplas conexões desnecessárias. 
 * O canal será usado para publicar ou consumir mensagens das filas do RabbitMQ.
 */

const { connectRabbitMQ } = require('../config/rabbitmq');

async function sendMessage(req, res) {
  try {
    const channel = await connectRabbitMQ(); // <- esse `await` é fundamental
    const queue = 'mensagens';
    const payload = Buffer.from(JSON.stringify({ msg: 'teste' }));

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, payload); // <- aqui não deve dar erro

    return res.json({ success: true, message: 'Mensagem enviada' });
  } catch (error) {
    console.error('Erro no sendMessage:', error);
    return res.status(500).json({ success: false, message: 'Erro ao enviar mensagem' });
  }
}
