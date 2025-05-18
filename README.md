# 🧠 Next.js 19+ com Google Cloud Speech-to-Text + Gemini AI

Este projeto é uma aplicação baseada em Next.js 19+ que utiliza os serviços do Google Cloud Speech-to-Text para transcrição de áudio em texto e o modelo Gemini AI para análise e resposta inteligente. O objetivo é facilitar a execução local e o entendimento da estrutura do projeto.

## 🚀 Tecnologias Utilizadas

- [Node.js 22+](https://nodejs.org/)
- [Next.js 19+](https://nextjs.org/)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Gemini AI (Google Generative AI)](https://ai.google.dev/)

---

## ⚙️ Pré-requisitos

- Node.js v22 ou superior
- Conta na [Google Cloud](https://console.cloud.google.com/)
- Projeto configurado com o serviço Speech-to-Text habilitado
- Conta com acesso à API do Gemini AI
- Chave de serviço (Service Account) do Google Cloud com permissões para Speech-to-Text

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/devguerreiro/pitch-matador.git
cd pitch-matador

# Instale as dependências
npm install
```

---

## 🔐 Configuração

Crie um arquivo `.env.local` na raiz do projeto com base no exemplo `.env.example`:

```env
# GEMINI
GOOGLE_AI_API_KEY=""

# GOOGLE CLOUD
GOOGLE_CLOUD_TYPE=""
GOOGLE_CLOUD_PROJECT_ID=""
GOOGLE_CLOUD_PRIVATE_KEY_ID=""
GOOGLE_CLOUD_PRIVATE_KEY=""
GOOGLE_CLOUD_CLIENT_EMAIL=""
GOOGLE_CLOUD_CLIENT_ID=""
GOOGLE_CLOUD_AUTH_URI=""
GOOGLE_CLOUD_TOKEN_URI=""
GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL=""
GOOGLE_CLOUD_CLIENT_X509_CERT_URL=""
GOOGLE_CLOUD_UNIVERSE_DOMAIN=""
```

---

## ▶️ Executando Localmente

```bash
npm run dev
```

Acesse em seu navegador: [http://localhost:3000](http://localhost:3000)
