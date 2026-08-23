const express = require('express');
const multer = require('multer');
const { toFile } = require('groq-sdk');
const groq = require('../config/groq');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = await toFile(req.file.buffer, req.file.originalname || 'audio');
    const transcription = await groq.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      file,
    });
    res.json({ transcript: transcription.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
