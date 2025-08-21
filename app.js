import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lista predefinida de uids válidos
const allowedUIDs = ["cbbc9584-8c1a-4243-a1f6-a37bd6e00cb1", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb2", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb3", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb4", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb5", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb6", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb7", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb8", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb9", "cbbc9584-8c1a-4243-a1f6-a37bd6e00cb0"];

app.get("/", (req, res) => {
  res.send("✅ Token Service corriendo en Render");
});

app.post("/token", async (req, res) => {
  const { uid } = req.body;

  console.log("----- NUEVA PETICIÓN /token -----");
  console.log("Body recibido:", req.body);

  if (!uid) {
    return res.status(400).json({ error: "Falta el parámetro uid" });
  }

  if (allowedUIDs.includes(uid)) {
    // Genera un token simulado
    const token = `token-${uid}-${Date.now()}`;
    const finalUrl = `https://vix.com/es-es/${token}`;

    return res.json({
      uid,
      token,
      url: finalUrl
    });
  } else {
    // UID no permitido → fallback
    return res.json({
      uid,
      fallback: "https://www.google.com"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
