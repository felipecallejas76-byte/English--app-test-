import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Necesario para rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal (frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Ruta IA
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
          { role: "system", content: "Eres un profesor de inglés." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data); // 👈 para ver error en logs

    res.json({
      result: data.choices?.[0]?.message?.content || "Error IA"
    });

  } catch (error) {
    console.error(error);
    res.json({ result: "Error del servidor" });
  }
});
  
