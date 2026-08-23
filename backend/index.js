const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', require('./routes/transcribe'));
app.use('/', require('./routes/structureNote'));
app.use('/', require('./routes/lectureNote'));
app.use('/', require('./routes/notes'));
app.use('/', require('./routes/explain'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
