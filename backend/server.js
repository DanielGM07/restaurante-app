// backend/server.js
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ⚠️⚠️⚠️ IMPORTANTE ⚠️⚠️⚠️
// Acá TENÉS QUE PONER el ACCESS TOKEN DE PRODUCCIÓN de la cuenta de tu amigo.
// Es el que empieza con "APP_USR-...".
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-5857339414027346-112022-1bda81d0703f4eef84c41fa1bc65fe89-839534249"
});

const preference = new Preference(client);

// Ruta para crear preferencia de pago
app.post("/create-preference", async (req, res) => {
  try {
    const { items, external_reference } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Faltan items para la preferencia" });
    }

    const body = {
      items: items.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price),
        currency_id: item.currency_id || "ARS"
      })),
      external_reference: external_reference || "pedido-sin-ref"
    };

    const result = await preference.create({ body });

    // URL de pago de producción
    return res.json({
      init_point: result.init_point,
      id: result.id
    });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
});

app.listen(port, () => {
  console.log(`Servidor de Mercado Pago escuchando en http://localhost:${port}`);
});
