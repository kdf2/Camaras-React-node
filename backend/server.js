import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const APP_KEY = "9bb1adb43b4640f8ae5d99fca5f9a970";
const APP_SECRET = "719f2fb6a00c4e9d90a5e0060c041eb0";

let cachedToken = null;
let cachedExpireTime = 0;

// 🔄 Obtener token nuevo
async function getNewToken() {
  const resp = await fetch("https://open.ezvizlife.com/api/lapp/token/get", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `appKey=${APP_KEY}&appSecret=${APP_SECRET}`,
  });

  const data = await resp.json();
  console.log("🔄 Nuevo token generado:", data);

  if (data.code === "200") {
    cachedToken = data.data.accessToken;
    cachedExpireTime = data.data.expireTime;
  }

  return data;
}

// 🟢 Endpoint del token con cache
app.get("/token", async (req, res) => {
  const now = Date.now();

  if (cachedToken && now < cachedExpireTime) {
    return res.json({
      code: "200",
      msg: "OK (from cache)",
      data: { accessToken: cachedToken, expireTime: cachedExpireTime }
    });
  }

  const newTokenData = await getNewToken();
  res.json(newTokenData);
});

// 📡 Obtener cámaras + nombre + estado + encriptación
app.get("/cameras", async (req, res) => {
  try {
    let tokenResp;

    if (!cachedToken || Date.now() >= cachedExpireTime) {
      tokenResp = await getNewToken();
    } else {
      tokenResp = {
        code: "200",
        data: { accessToken: cachedToken }
      };
    }

    if (tokenResp.code !== "200") {
      return res.status(500).json({ error: "No se pudo obtener el token" });
    }

    const accessToken = tokenResp.data.accessToken;

    const camResp = await fetch(
      "https://open.ezvizlife.com/api/lapp/device/list",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `accessToken=${accessToken}`
      }
    );

    const camData = await camResp.json();
    console.log("📷 Lista de cámaras:", camData);

    // 👇 Transformamos la data para enviar solo lo importante
    if (camData.code === "200") {
      const list = camData.data.map(c => ({
        serial: c.deviceSerial,
        name: c.deviceName,
        online: c.status === 1,
        
      }));

      return res.json(list);
    }

    res.json([]);

  } catch (err) {
    console.error("❌ Error en /cameras:", err);
    res.status(500).json({ error: "Error obteniendo cámaras" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
