import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// “Base de datos” temporal (en memoria)
let users = [];

/* =========================
   REGISTRO
========================= */
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const exists = users.find(u => u.email === email);
  if (exists) return res.json({ success: false, message: "Usuario ya existe" });

  users.push({
    email,
    password,
    progress: 0,
    streak: 0
  });

  res.json({ success: true });
});

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.json({ success: false });
  }

  res.json({ success: true, user });
});

/* =========================
   GUARDAR PROGRESO
========================= */
app.post("/progress", (req, res) => {
  const { email, progress } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) return res.json({ success: false });

  user.progress = progress;

  res.json({ success: true });
});

/* =========================
   IA (OpenAI PROXY)
========================= */
app.post("/ai", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un profesor de inglés. Corrige y explica errores."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      success: true,
      result: data.choices?.[0]?.message?.content || "Error"
    });

  } catch (error) {
    res.json({ success: false, error: "Fallo IA" });
  }
});

/* =========================
   PAYPAL (PLACEHOLDER)
========================= */
app.post("/create-order", (req, res) => {
  // Aquí luego conectas PayPal real
  res.json({ id: "FAKE_ORDER_ID" });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
