const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// "Base de datos" en memoria con algunos UIDs
let usersDB = {
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb1": { token: "abc123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb2": { token: "abc456" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb3": { token: "abc789" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb4": { token: "def123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb5": { token: "def456" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb6": { token: "def789" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb7": { token: "ghi123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb8": { token: "xyz7890123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb9": { token: "ghi456" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb0": { token: "ghi789" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f51": { token: "jkl123" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f52": { token: "jkl456" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f53": { token: "jkl789" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f54": { token: "mno123" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f55": { token: "mno456" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f56": { token: "mno789" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f57": { token: "pqr123" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f58": { token: "pqr456" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f59": { token: "pqr789" },
  "ff329bf7-cfd4-4ab1-a9be-f384740d0f50": { token: "lmn456" }
};

// Función para generar tokens persistentes
function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

// Endpoint de verificación
app.get("/check", (req, res) => {
  const { uid } = req.query;

  console.log("----- NUEVA PETICIÓN /check -----");
  console.log("Query completa recibida:", req.query);
  console.log("UID recibido:", uid);

  if (!uid) {
    return res.status(400).json({
      error: "UID es requerido",
      debug_query: req.query, // 👈 debug
    });
  }

  if (usersDB[uid]) {
    return res.json({
      uid: uid,
      token: usersDB[uid].token,
      debug_query: req.query, // 👈 debug
    });
  } else {
    return res.status(404).json({
      error: "UID not found",
      debug_query: req.query, // 👈 debug
    });
  }
});

// Endpoint para registrar nuevos usuarios manualmente
app.get("/register", (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "UID es requerido" });
  }

  if (usersDB[uid]) {
    return res.json({ message: "UID ya registrado", uid, token: usersDB[uid].token });
  }

  const token = generateToken();
  usersDB[uid] = { token };

  console.log("Nuevo usuario registrado:", uid, "con token:", token);

  res.json({ message: "UID registrado con éxito", uid, token });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});