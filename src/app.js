/**
 * Esse código configura seu servidor Node.js com 
 * Express e define uma única rota POST que:
 * Valida a mensagem;
 * Envia para a fila via RabbitMQ (controlador sendMessage);
 * Usa boas práticas com helmet, cors e express.json().
 */

// Carrega variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

// Importa o framework Express para criação do servidor HTTP
const express = require('express');

// Middleware para permitir requisições de origens diferentes (Cross-Origin)
const cors = require('cors');

// Middleware de segurança que adiciona cabeçalhos HTTP para proteger a aplicação
const helmet = require('helmet');

// Middleware de validação personalizado, usado para validar a estrutura da mensagem recebida
const { validateMessage } = require('./middleware/validation');

// Controlador responsável por processar o envio da mensagem
const { sendMessage } = require('./controllers/messageController');

// Cria uma instância do servidor Express
const app = express();

// Aplica o middleware Helmet para aumentar a segurança das requisições
app.use(helmet());

// Aplica o middleware CORS para permitir acesso à API por clientes externos (frontends, outros sistemas etc.)
app.use(cors());

// Permite que o servidor entenda requisições JSON no corpo das requisições HTTP
app.use(express.json());

/**
 * Define a rota POST "/api/messages/send"
 * Primeiro aplica o middleware de validação
 * Depois, se estiver tudo ok, chama o controlador que envia a mensagem
 */
app.post('/api/messages/send', validateMessage, sendMessage);

// Define a porta que o servidor vai escutar (pega do .env ou usa 3000 por padrão)
const PORT = process.env.PORT || 3000;

// Inicia o servidor e exibe mensagem no console
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
