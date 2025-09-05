# FluentEmojiAPI

FluentEmojiAPI is a simple and lightweight REST API that serves **Microsoft Fluent Emoji (SVG format)**.  
This project provides endpoints to list, search, and retrieve emoji details.

---

## 🚀 Features

- Serve Fluent Emoji SVG files.
- JSON endpoint with emoji metadata.
- Search emojis by name.
- Lightweight and easy to deploy (Express.js).

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/rianmubarok/fluentemojiapi.git
cd fluentemojiapi

# Install dependencies
npm install

# Start the server
node api.js
```

The server will run at:  
👉 `http://localhost:3000`

---

## 📖 API Endpoints

### 1. List all emojis

```
GET /emojis
```

**Example response:**

```json
[
  {
    "name": "1st place medal",
    "slug": "1st-place-medal",
    "unicode": "1f947",
    "group": "Activities",
    "glyph": "🥇",
    "keywords": ["1st place medal", "first", "gold", "medal"],
    "path": "/svg/1st-place-medal-color.svg",
    "variants": ["/svg/1st-place-medal-color.svg"]
  }
]
```

---

### 2. Search emojis by name/slug and filters

```
GET /emojis/search?q=medal
```

Supported filters (combine as needed):

- `q`: substring on name or slug (case-insensitive)
- `unicode`: exact unicode (e.g., `1f947`)
- `group`: exact group/category (e.g., `Activities`)
- `keyword`: substring across keywords
- `glyph`: exact glyph (e.g., 🥇)
- `hasVariants`: `true` or `false`

Examples:

```
GET /emojis/search?group=Smileys%20%26%20Emotion
GET /emojis/search?unicode=1f947
GET /emojis/search?keyword=medal
GET /emojis/search?glyph=%F0%9F%A5%87
GET /emojis/search?hasVariants=true
```

---

### 3. Get emoji details by name or slug

```
GET /emojis/:name
```

**Example request:**

```
GET /emojis/1st-place-medal
```

**Example response:**

```json
{
  "name": "1st place medal",
  "slug": "1st-place-medal",
  "unicode": "1f947",
  "group": "Activities",
  "glyph": "🥇",
  "keywords": ["1st place medal", "first", "gold", "medal"],
  "path": "/svg/1st-place-medal-color.svg",
  "variants": ["/svg/1st-place-medal-color.svg"]
}
```

---

### 4. Get emoji by exact slug

```
GET /emojis/by-slug/:slug
```

Example:

```
GET /emojis/by-slug/alien
```

---

## 📂 Project Structure

```
fluentemojiapi/
│
├─ api.js              # API server
├─ package.json        # Dependencies & scripts
│
├─ data/               # Emoji data
│   ├─ index.json      # Emoji metadata
│   └─ svg/            # Emoji SVG files
│
└─ README.md           # Documentation
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
