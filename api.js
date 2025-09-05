import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve file SVG
app.use("/svg", express.static(path.join(__dirname, "data/svg")));

// Endpoint daftar emoji
app.get("/emojis", (req, res) => {
  const data = readFileSync("data/index.json", "utf-8");
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`🚀 FluentEmojiAPI jalan di http://localhost:${PORT}`);
});
