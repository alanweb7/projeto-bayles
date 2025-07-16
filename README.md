# Projeto Bayles - Gateway de Mensagens com Node.js, Baileys e RabbitMQ

Este projeto é um gateway de mensageria assíncrona desenvolvido com Node.js, utilizando a biblioteca **Baileys** para envio e recebimento de mensagens via WhatsApp e **RabbitMQ** como broker. Foi estruturado com foco em escalabilidade, boas práticas e arquitetura limpa.

---

## 📌 Visão Geral

A aplicação expõe uma **API REST** para envio de mensagens via WhatsApp, utilizando uma arquitetura baseada em filas (RabbitMQ) para garantir comunicação assíncrona e confiável entre microserviços.

---

## 🎯 Objetivos

- Integrar **RabbitMQ** com **Node.js**
- Utilizar a biblioteca **Baileys** para envio/recebimento de mensagens
- Expor endpoints RESTful com **Express**
- Implementar tratamento de erros, validações e boas práticas
- Documentar adequadamente o código e a API

---

## 🧰 Tecnologias Utilizadas

- Node.js 16+
- Express.js
- Baileys (WhatsApp Web API)
- RabbitMQ
- Docker (opcional)
- amqplib
- dotenv

---

## 🗂 Estrutura do Projeto

```bash
projeto-bayles/
├── src/
│   ├── controllers/       # Lógica dos endpoints REST
│   ├── services/          # Integrações com Baileys e RabbitMQ
│   ├── middleware/        # Validações, erros, rate limit
│   ├── config/            # Conexões e variáveis de ambiente
│   ├── utils/             # Helpers e logs
│   └── app.js             # Inicialização do Express
├── tests/                 # Testes unitários e de integração
├── docker/                # Arquivos Docker (opcional)
├── docs/                  # Documentação da API
├── .env.example           # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md

```

## 🚀 Instalação na VPS (Ubuntu 20.04+)

Siga os passos abaixo para clonar, instalar e executar o projeto em uma VPS com Ubuntu (ou similar):

### ✅ Pré-requisitos

- Node.js 16 ou superior
- RabbitMQ instalado (localmente ou via Docker)
- Git instalado
- Acesso SSH com permissões `sudo`

---

### 🧱 1. Acesse sua VPS

```bash
ssh usuario@ip-da-sua-vps

# 🔧 2. Instale pacotes essenciais

sudo apt update && sudo apt install -y git curl build-essential

# 📦 3. Instale o Node.js (v16+)

curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v

# 🐰 4. Instale o RabbitMQ (caso use localmente)
sudo apt install -y rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
sudo rabbitmqctl status

# 📥 5. Clone o repositório
git clone https://github.com/alanweb7/projeto-bayles.git
cd projeto-bayles

```

## 📨 Endpoint: Envio de Mensagens

### ➤ Rota
```http
POST /api/messages/send

```
## 📥 Payload de Entrada (JSON)

```bash
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

### 📄 Estrutura do Payload

| Campo                        | Tipo                             | Obrigatório | Descrição                             |
|-----------------------------|----------------------------------|-------------|----------------------------------------|
| `queue`                     | string                           | ✅           | Nome da fila RabbitMQ                  |
| `message.id`                | string                           | ✅           | ID único da mensagem                   |
| `message.content`           | string                           | ✅           | Conteúdo da mensagem                   |
| `message.timestamp`         | string (ISO 8601)                | ✅           | Data/hora da criação da mensagem       |
| `message.metadata.sender`   | string                           | ✅           | Nome do serviço que gerou a mensagem   |
| `message.metadata.priority` | string (`high`, `medium`, `low`) | ✅           | Prioridade da mensagem                 |

