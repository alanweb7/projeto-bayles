/**
 * Esse código configura seu servidor Node.js com 
 * Express e define uma única rota POST que:
 * Valida a mensagem;
 * Envia para a fila via RabbitMQ (controlador sendMessage);
 * Usa boas práticas com helmet, cors e express.json().
 */

// Carrega variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { validateMessage } = require('./middleware/validation');
const { sendMessage } = require('./controllers/messageController');
const { receiveMessages } = require('./controllers/messageReceiverController');
const { queueStatus } = require('./controllers/queueController'); // <- verifique se está exportando certo!

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/api/messages/send', validateMessage, sendMessage);
app.get('/api/messages/receive/:queueName', receiveMessages);
app.get('/api/queues/status', queueStatus);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
