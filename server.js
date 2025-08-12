const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 🔐 Load secrets from Replit environment variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// ✅ Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ No image uploaded');
  }

  const form = new FormData();
  form.append('chat_id', CHAT_ID);
  form.append('photo', fs.createReadStream(req.file.path));

  try {
    // 📤 Send image to Telegram
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders()
    });

    res.send('✅ Image sent to Telegram!');
  } catch (err) {
    console.error('Telegram error:', err.message);
    res.status(500).send('❌ Failed to send image');
  } finally {
    // 🧹 Delete temp file
    fs.unlink(req.file.path, () => {
      console.log('🧼 Temp file deleted');
    });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
