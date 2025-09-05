import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // allow requests from other frontends
app.use(express.json());

// Load emoji index once (cache in memory)
let indexData = [];
try {
  const raw = readFileSync(path.join(__dirname, "data/index.json"), "utf-8");
  indexData = JSON.parse(raw);
} catch (err) {
  console.error("❌ Failed to load index.json:", err.message);
  process.exit(1);
}

// Serve SVG files
app.use("/svg", express.static(path.join(__dirname, "data/svg")));

// Endpoint: get all emojis
app.get("/emojis", (req, res) => {
  res.json(indexData);
});

// Endpoint: search emojis by name (?q=...)
app.get("/emojis/search", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  const result = indexData.filter((e) => e.name.toLowerCase().includes(q));
  res.json(result);
});

// Endpoint: get emoji details by name
app.get("/emojis/:name", (req, res) => {
  const { name } = req.params;
  const emoji = indexData.find((e) => e.name === name);

  if (emoji) {
    res.json(emoji);
  } else {
    res.status(404).json({ error: "Emoji not found" });
  }
});

// Default route (mini docs)
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Welcome to FluentEmojiAPI",
    endpoints: [
      { path: "/emojis", description: "List all emojis" },
      { path: "/emojis/search?q=heart", description: "Search emojis by name" },
      { path: "/emojis/:name", description: "Get emoji details by name" },
      { path: "/svg/heart.svg", description: "Access raw SVG file" },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FluentEmojiAPI running at http://localhost:${PORT}`);
});
