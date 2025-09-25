const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Import QR and Pair routes
const qrRoute = require('./qr');
const codeRoute = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static public assets
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/qr', qrRoute);
app.use('/code', codeRoute);

// HTML Pages
app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ ANYWAY-XMD UI running at: http://localhost:${PORT}`);
});

module.exports = app;
