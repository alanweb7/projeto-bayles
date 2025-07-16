# 📬 Projeto Bayles – Gateway de Mensagens com Node.js, Baileys e RabbitMQ

Este projeto é um gateway de mensageria assíncrona desenvolvido com Node.js, utilizando a biblioteca **Baileys** para envio e recebimento de mensagens via WhatsApp e **RabbitMQ** como broker de mensagens.

---

## 📌 Visão Geral

A aplicação expõe uma **API REST** para envio de mensagens via WhatsApp, utilizando uma arquitetura baseada em filas (**RabbitMQ**) para garantir comunicação assíncrona, escalável e confiável entre microserviços.

---

## 🎯 Objetivos

- Integrar **RabbitMQ** com **Node.js**
- Utilizar **Baileys** para WhatsApp Messaging
- Criar endpoints RESTful com **Express**
- Implementar boas práticas: validação, erros, segurança
- Documentar API e código de forma clara

---

## 🧰 Tecnologias Utilizadas

- Node.js 16+
- Express.js
- Baileys
- RabbitMQ
- amqplib
- dotenv
- Joi
- CORS & Helmet
- Jest + Supertest (para testes)
- Docker e Docker Compose (opcional)

---

## 📂 Estrutura do Projeto

```bash
projeto-bayles/
├── src/
│   ├── controllers/         # Lógica dos endpoints REST
│   ├── services/            # Integrações com Baileys e RabbitMQ
│   ├── middleware/          # Validações, erros, rate limit
│   ├── config/              # Conexões e variáveis de ambiente
│   ├── utils/               # Helpers e logs
│   └── app.js               # Inicialização do Express
├── tests/                   # Testes unitários e de integração
├── docker/                  # Arquivos Docker (opcional)
├── docs/                    # Documentação da API
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instalação Local

### 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/projeto-bayles.git
cd projeto-bayles
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas configurações (RabbitMQ, WhatsApp etc).

### 4. Iniciar o projeto

```bash
npm start
```

---

## 🐳 Executando com Docker (opcional)

```bash
cd docker
docker-compose up --build
```

---

## 💻 Instalação em uma VPS (Ubuntu 20.04+)

### ✅ Pré-requisitos

- Node.js 16+
- RabbitMQ instalado (ou Docker)
- Git

### 🔧 Passo a passo

```bash
# Acesse sua VPS
ssh usuario@ip-da-vps

# Instale pacotes necessários
sudo apt update && sudo apt install -y git curl build-essential

# Instale Node.js 16+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instale RabbitMQ (caso local)
sudo apt install -y rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

# 📦 Instalar Redis (caso local)
# Instale o cliente Redis para Node.js
npm install redis

# Instale as ferramentas de linha de comando
sudo apt update
sudo apt install -y redis-tools redis-server

# Inicie o servidor Redis
sudo systemctl start redis-server

# (Opcional) Ative o Redis na inicialização do sistema
sudo systemctl enable redis-server

# Verifique se está funcionando
redis-cli ping
# Esperado: PONG


# Clone o projeto
git clone https://github.com/alanweb7/projeto-bayles.git
cd projeto-bayles

# Instale dependências
npm install

# Configure o .env
cp .env.example .env
nano .env

# Inicie a aplicação
npm start
```

---

## 🛠 (Opcional) Rodar como serviço com PM2

```bash
npm install -g pm2
pm2 start src/app.js --name projeto-bayles
pm2 save
pm2 startup
```

---

## 📩 API: Enviar Mensagens

### ➔ Rota

```http
POST /api/messages/send
```

### 📄 Descrição

Recebe mensagens via HTTP e envia para uma fila RabbitMQ.\
O processamento da fila é feito de forma assíncrona por um consumer que utiliza **Baileys** para enviar via WhatsApp.

---

### 📅 Payload de Entrada

```json
{
  "queue": "nome_da_fila",
  "message": {
    "id": "unique_message_id",
    "content": "conteúdo da mensagem",
    "timestamp": "2024-01-15T10:30:00Z",
    "metadata": {
      "sender": "service_name",
      "priority": "high"
    }
  }
}
```

### 🧾 Estrutura do Payload

| Campo                       | Tipo                             | Obrigatório | Descrição                            |
| --------------------------- | -------------------------------- | ----------- | ------------------------------------ |
| `queue`                     | string                           | ✅           | Nome da fila RabbitMQ                |
| `message.id`                | string                           | ✅           | ID único da mensagem                 |
| `message.content`           | string                           | ✅           | Conteúdo da mensagem                 |
| `message.timestamp`         | string (ISO 8601)                | ✅           | Data/hora da criação da mensagem     |
| `message.metadata.sender`   | string                           | ✅           | Nome do serviço que gerou a mensagem |
| `message.metadata.priority` | string (`high`, `medium`, `low`) | ✅           | Prioridade da mensagem               |

---

### ✅ Exemplo de Resposta

```json
{
  "success": true,
  "messageId": "unique_message_id",
  "queueName": "nome_da_fila",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🤖 Testes

```bash
npm test
```

---

## 📄 Licença

MIT © [Seu Nome]

