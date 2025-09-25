const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Import QR and Pair routes
const qrRoute = require('./qr');      // QR image response
const codeRoute = require('./pair');  // Pair code response

require('events').EventEmitter.defaultMaxListeners = 500;

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files if needed (e.g., CSS, JS, images in /public)
app.use(express.static(path.join(__dirname, 'public')));

// Backend Routes
app.use('/qr', qrRoute);     // Route for QR code
app.use('/code', codeRoute); // Route for Pair code

// HTML Pages
app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// --- WhatsApp Bot Session Setup ---
const { useSingleFileAuthState, default: makeWASocket } = require('@whiskeysockets/baileys');
const { state, saveState } = useSingleFileAuthState('./ANYWAY-XMD.json');

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // optional, prints QR if needed
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if(connection === 'close') {
      console.log('❌ Bot disconnected, reconnecting...');
      startBot();
    } else if(connection === 'open') {
      console.log('✅ ANYWAY-XMD Bot is online!');
    }
  });

  // Example message handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    console.log('📩 New message received!');
    // You can add your bot logic here
  });
}

// Start bot
startBot().catch(err => console.log('Bot start error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`✅ ANYWAY-XMD UI running at: http://localhost:${PORT}`);
});

module.exports = app;
