const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Connection successful!' });
});

// app.use('/api/teachers', require('./routes/teachers'));
// app.use('/api/employers', require('./routes/employers'));

PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || PORT, () => {
  console.log('Server running on port ' + PORT);
});
