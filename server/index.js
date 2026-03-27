require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const scanRoutes = require('./routes/scan');
const telegramBot = require('./utils/telegramBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads and outputs directories exist
['uploads', 'outputs'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// ✅ CORS FIX (important for deployment)
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
app.use('/api/scan', scanRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Scanner API running' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumescanner')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️ MongoDB not connected:', err.message));

// Telegram Bot
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegramBot.init(app);
  console.log('🤖 Telegram Bot initialized');
} else {
  console.log('⚠️ TELEGRAM_BOT_TOKEN not set');
}

// ✅ FINAL SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});