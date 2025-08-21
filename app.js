import express from "express";
import fetch from "node-fetch"; // si usas Node 18+, puedes usar global fetch

const app = express();

// Asegura parseo JSON:
app.use(express.json()); // requiere Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // por si Braze manda urlencoded

// ENV obligatorias:
const BRAZE_API_KEY = process.env.BRAZE_API_KEY; // crea esta variable en Render
const BRAZE_REST_ENDPOINT = process.env.BRAZE_REST_ENDPOINT || "https://rest.iad-05.braze.com"; 
// cambia iad-01 a tu cluster si no es ese (ej: "https://rest.fra-01.braze.com")

// UIDs válidos que ya manejabas (si los sigues necesitando)
const VALID_UIDS = new Set([
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

function generateTokenFor(uid) {
  // aquí puedes mantener tu persistencia si ya la tienes
  // de momento, simulemos un token estable por uid:
  if (!uid) return "";
  return "tok_" + Buffer.from(uid).toString("hex").slice(0, 10);
}

async function writeUniTokenToBraze({ external_id, token }) {
  const urlToStore = token
    ? `https://vix.com/es-es?crmtoken=${encodeURIComponent(token)}`
    : "https://www.google.com";

  const res = await fetch(`${BRAZE_REST_ENDPOINT}/users/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${BRAZE_API_KEY}`
    },
    body: JSON.stringify({
      attributes: [
        {
          external_id,
          "uni-token": urlToStore
        }
      ]
    })
  });

  const data = await res.json();
  console.log("Braze /users/track response:", data);
  return { ok: res.ok, data };
}

app.post("/check", async (req, res) => {
  try {
    const { uid, external_id } = req.body || {};

    console.log("----- NUEVA PETICIÓN /check (POST) -----");
    console.log("Body recibido:", req.body);

    if (!uid || !external_id) {
      console.log("Faltan campos:", { uid, external_id });
      return res.status(400).json({ error: "uid y external_id son requeridos" });
    }

    if (!VALID_UIDS.has(uid)) {
      console.log("UID no válido:", uid);
      // aun así guardamos fallback en Braze para depurar
      await writeUniTokenToBraze({ external_id, token: "" });
      return res.status(404).json({ uid, token: "", reason: "uid_not_found" });
    }

    const token = generateTokenFor(uid);

    // 1) responde a Braze para que el Webhook vea 200
    // 2) además escribe el custom attribute en Braze
    const brazeResult = await writeUniTokenToBraze({ external_id, token });

    return res.json({
      uid,
      token,
      braze: brazeResult.data,
      status: brazeResult.ok ? "stored" : "store_failed"
    });
  } catch (err) {
    console.error("Error en /check:", err);
    return res.status(500).json({ error: err?.message || "internal_error" });
  }
});

// (opcional) compatibilidad con GET ?uid=...&external_id=...
app.get("/check", async (req, res) => {
  try {
    const uid = req.query.uid;
    const external_id = req.query.external_id;

    console.log("----- NUEVA PETICIÓN /check (GET) -----");
    console.log("Query recibido:", req.query);

    if (!uid || !external_id) {
      return res.status(400).json({ error: "uid y external_id son requeridos" });
    }

    if (!VALID_UIDS.has(uid)) {
      await writeUniTokenToBraze({ external_id, token: "" });
      return res.status(404).json({ uid, token: "", reason: "uid_not_found" });
    }

    const token = generateTokenFor(uid);
    const brazeResult = await writeUniTokenToBraze({ external_id, token });

    return res.json({
      uid,
      token,
      braze: brazeResult.data,
      status: brazeResult.ok ? "stored" : "store_failed"
    });
  } catch (err) {
    console.error("Error en /check (GET):", err);
    return res.status(500).json({ error: err?.message || "internal_error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Service running on ${PORT}`));
