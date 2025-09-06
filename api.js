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

// Helper function to modify SVG with size parameters
function modifySvgWithSize(svgContent, size) {
  if (!size) return svgContent;

  // Parse size parameter (can be "width", "height", or "widthxheight")
  let width, height;
  if (size.includes("x")) {
    [width, height] = size.split("x");
  } else {
    width = height = size;
  }

  // Validate size values (must be positive numbers)
  const widthNum = parseInt(width);
  const heightNum = parseInt(height);

  if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
    return svgContent; // Return original if invalid size
  }

  // Modify SVG content to replace existing width and height attributes
  return svgContent.replace(/<svg([^>]*?)>/, (match, attributes) => {
    // Remove existing width and height attributes
    let cleanAttributes = attributes
      .replace(/\s*width\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s*height\s*=\s*["'][^"']*["']/gi, "");

    // Add new width and height attributes
    return `<svg${cleanAttributes} width="${widthNum}" height="${heightNum}">`;
  });
}

// Endpoint: serve SVG files with optional size parameter
app.get("/svg/:filename", (req, res) => {
  const { filename } = req.params;
  const { size } = req.query;

  // Decode URL-encoded filename for deployment compatibility
  const decodedFilename = decodeURIComponent(filename);

  // Validate filename (basic security check)
  if (
    !decodedFilename.endsWith(".svg") ||
    decodedFilename.includes("..") ||
    decodedFilename.includes("/") ||
    decodedFilename.includes("\\")
  ) {
    console.log("Invalid filename:", decodedFilename);
    return res.status(400).send("Invalid filename: " + decodedFilename);
  }

  try {
    const filePath = path.join(__dirname, "data/svg", decodedFilename);
    const svgContent = readFileSync(filePath, "utf-8");

    if (size) {
      const modifiedSvg = modifySvgWithSize(svgContent, size);
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(modifiedSvg);
    } else {
      res.setHeader("Content-Type", "image/svg+xml");
      res.send(svgContent);
    }
  } catch (err) {
    console.log("SVG file not found:", decodedFilename, "Error:", err.message);
    res.status(404).send("SVG file not found: " + decodedFilename);
  }
});

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

// Endpoint: get SVG based on unicode with optional size parameter
app.get("/svg/unicode/:unicode", (req, res) => {
  const unicodeReq = req.params.unicode.toLowerCase();
  const { size } = req.query;

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
    try {
      const filePath = path.join(__dirname, "data", emoji.path);
      const svgContent = readFileSync(filePath, "utf-8");

      if (size) {
        const modifiedSvg = modifySvgWithSize(svgContent, size);
        res.setHeader("Content-Type", "image/svg+xml");
        res.send(modifiedSvg);
      } else {
        res.setHeader("Content-Type", "image/svg+xml");
        res.send(svgContent);
      }
    } catch (err) {
      console.log(
        "Unicode SVG file not found:",
        unicodeReq,
        "Path:",
        emoji.path,
        "Error:",
        err.message
      );
      res
        .status(404)
        .send("Emoji SVG file not found for unicode: " + unicodeReq);
    }
  } else {
    console.log("Unicode not found:", unicodeReq);
    res.status(404).send("Emoji SVG not found for unicode: " + unicodeReq);
  }
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
        path: "/svg/alien-color.svg?size=64",
        description: "Access SVG with custom size (64x64)",
      },
      {
        path: "/svg/alien-color.svg?size=100x50",
        description: "Access SVG with custom dimensions (100x50)",
      },
      {
        path: "/svg/unicode/1f947",
        description: "Get SVG by unicode (supports skintones)",
      },
      {
        path: "/svg/unicode/1f947?size=32",
        description: "Get SVG by unicode with custom size",
      },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FluentEmojiAPI running at http://localhost:${PORT}`);
});
