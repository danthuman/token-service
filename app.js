const express = require('express');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

app.get('/token', (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
