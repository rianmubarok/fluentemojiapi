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

// Endpoint: search emojis with filters
// Supported query params:
// - q: substring match against name or slug (case-insensitive)
// - unicode: exact match against e.unicode (case-insensitive, without 0x prefix)
// - group: exact match against e.group (case-insensitive)
// - keyword: substring match over keywords (case-insensitive)
// - glyph: exact match against glyph character (e.g., "🥇")
// - hasVariants: "true" | "false" to filter presence of variants
app.get("/emojis/search", (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  const unicodeQ = (req.query.unicode || "").toString().toLowerCase();
  const groupQ = (req.query.group || "").toString().toLowerCase();
  const keywordQ = (req.query.keyword || "").toString().toLowerCase();
  const glyphQ = (req.query.glyph || "").toString();
  const hasVariantsQ = (req.query.hasVariants || "").toString().toLowerCase();

  const result = indexData.filter((e) => {
    // q across name or slug
    if (q) {
      const name = (e.name || "").toLowerCase();
      const slug = (e.slug || "").toLowerCase();
      if (!name.includes(q) && !slug.includes(q)) return false;
    }

    // unicode exact (normalized lower-case)
    if (unicodeQ) {
      const u = (e.unicode || "").toString().toLowerCase();
      if (u !== unicodeQ) return false;
    }

    // group exact (case-insensitive)
    if (groupQ) {
      const g = (e.group || "").toString().toLowerCase();
      if (g !== groupQ) return false;
    }

    // keyword substring across keywords array
    if (keywordQ) {
      const kws = Array.isArray(e.keywords) ? e.keywords : [];
      const has = kws.some((k) =>
        (k || "").toString().toLowerCase().includes(keywordQ)
      );
      if (!has) return false;
    }

    // glyph exact
    if (glyphQ) {
      if ((e.glyph || "") !== glyphQ) return false;
    }

    // hasVariants boolean filter
    if (hasVariantsQ === "true") {
      if (!Array.isArray(e.variants) || e.variants.length === 0) return false;
    } else if (hasVariantsQ === "false") {
      if (Array.isArray(e.variants) && e.variants.length > 0) return false;
    }

    return true;
  });

  res.json(result);
});

// Endpoint: list available groups/categories
app.get("/emojis/groups", (req, res) => {
  const groups = Array.from(
    new Set(indexData.map((e) => (e.group || "").toString()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  res.json(groups);
});

// Endpoint: get emoji details by name (exact) or fallback to slug match
app.get("/emojis/:name", (req, res) => {
  const { name } = req.params;
  const byName = indexData.find((e) => e.name === name);
  if (byName) return res.json(byName);
  const bySlug = indexData.find((e) => e.slug === name);
  if (bySlug) return res.json(bySlug);
  res.status(404).json({ error: "Emoji not found" });
});

// Endpoint: get emoji details by slug (exact)
app.get("/emojis/by-slug/:slug", (req, res) => {
  const { slug } = req.params;
  const emoji = indexData.find((e) => e.slug === slug);
  if (emoji) return res.json(emoji);
  res.status(404).json({ error: "Emoji not found" });
});

// Endpoint: get SVG based on unicode
app.get("/svg/:unicode", (req, res) => {
  const unicodeReq = req.params.unicode.toLowerCase();
  const emoji = indexData.find((e) => {
    // check main unicode
    if (e.unicode && e.unicode.toLowerCase() === unicodeReq) return true;
    // check skintone unicodes (array)
    if (Array.isArray(e.unicodeSkintones)) {
      return e.unicodeSkintones.some((u) => u.toLowerCase() === unicodeReq);
    }
    return false;
  });

  if (emoji) {
    const filePath = path.join(__dirname, "data", emoji.path);
    return res.sendFile(filePath);
  }

  res.status(404).send("Emoji SVG not found for unicode: " + unicodeReq);
});

// Default route (mini docs)
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Welcome to FluentEmojiAPI",
    endpoints: [
      { path: "/emojis", description: "List all emojis" },
      { path: "/emojis/search?q=heart", description: "Search by name or slug" },
      {
        path: "/emojis/search?group=Smileys%20%26%20Emotion",
        description: "Filter by group",
      },
      {
        path: "/emojis/search?unicode=1f947",
        description: "Filter by unicode",
      },
      {
        path: "/emojis/search?keyword=medal",
        description: "Filter by keyword",
      },
      {
        path: "/emojis/search?glyph=%F0%9F%A5%87",
        description: "Filter by glyph",
      },
      {
        path: "/emojis/search?hasVariants=true",
        description: "Filter variant presence",
      },
      {
        path: "/emojis/groups",
        description: "List available groups/categories",
      },
      {
        path: "/emojis/:name",
        description: "Get details by exact name or slug",
      },
      { path: "/emojis/by-slug/alien", description: "Get details by slug" },
      {
        path: "/svg/alien-color.svg",
        description: "Access raw SVG (color style)",
      },
      {
        path: "/svg/1f947",
        description: "Get SVG by unicode (supports skintones)",
      },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FluentEmojiAPI running at http://localhost:${PORT}`);
});
