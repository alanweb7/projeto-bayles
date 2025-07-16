require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { validateMessage } = require('./middleware/validation');
const { sendMessage } = require('./controllers/messageController');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/api/messages/send', validateMessage, sendMessage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
