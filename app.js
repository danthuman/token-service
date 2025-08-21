const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Simulación de base de datos en memoria
const usersDB = {
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb1": { token: "abc123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb2": { token: "abc456" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb3": { token: "abc789" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb4": { token: "def123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb5": { token: "def456" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb6": { token: "def789" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb7": { token: "ghi123" },
  "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb8": { token: "xyz789" },
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

// Endpoint para verificar UID
app.get("/check", (req, res) => {
  const { uid } = req.query;

  // 🚨 Logs de debug
  console.log("----- NUEVA PETICIÓN /check -----");
  console.log("Query completa recibida:", req.query);
  console.log("UID recibido:", uid);

  if (!uid) {
    console.log("⚠️ No se envió UID en la petición.");
    return res.status(400).json({ error: "UID es requerido" });
  }

  if (usersDB[uid]) {
    console.log("✅ UID encontrado en la base:", uid);
    return res.json({ uid: uid, token: usersDB[uid].token });
  } else {
    console.log("❌ UID no encontrado:", uid);
    return res.status(404).json({ error: "UID not found" });
  }
});

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Token Service is running ✅");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});