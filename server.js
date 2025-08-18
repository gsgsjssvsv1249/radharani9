const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use('/images', express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename, url: `/images/${req.file.filename}` });
});

app.listen(3000, () => console.log('Server running on port 3000'));
