const express = require('express');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

// Lista de UIDs válidos
const validUIDs = new Set([
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb1",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb2",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb3",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb4",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb5",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb6",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb7",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb8",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb9",
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb0",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f51",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f52",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f53",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f54",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f55",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f56",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f57",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f58",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f59",
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f50"
]);

// Endpoint para verificar UID
app.get('/check', (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "uid is required" });
  }

  if (validUIDs.has(uid)) {
    const token = crypto.randomBytes(16).toString('hex');
    res.json({ uid, token });
  } else {
    res.status(404).json({ error: "uid not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
