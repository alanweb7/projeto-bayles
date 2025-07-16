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


