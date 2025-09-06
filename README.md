# FluentEmojiAPI

FluentEmojiAPI is a simple and lightweight REST API that serves **Microsoft Fluent Emoji (SVG format)**.  
This project provides endpoints to list, search, and retrieve emoji details.

---

## ![rocket](https://fluentemojiapi-production.up.railway.app/svg/1f680) Features

- Serve Fluent Emoji SVG files with customizable dimensions.
- JSON endpoint with emoji metadata.
- Search emojis by name, unicode, group, keywords, and more.
- Get SVG files directly by filename or unicode (supports skintone variants).
- Dynamic SVG sizing via URL parameters (`?size=64` or `?size=100x50`).
- Lightweight and easy to deploy (Express.js).

---

## ![package](https://fluentemojiapi-production.up.railway.app/svg/1f4e6) Installation

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
![point_right](https://fluentemojiapi-production.up.railway.app/svg/1f449) `http://localhost:3000`

---

## ![open_book](https://fluentemojiapi-production.up.railway.app/svg/1f4d6) API Endpoints

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

### 5. Get SVG file by filename

```
GET /svg/:filename
```

Access SVG files directly by their filename. Supports optional size parameter for custom dimensions.

**Examples:**

```bash
# Get original SVG
GET /svg/alien-color.svg

# Get SVG with custom size (square)
GET /svg/alien-color.svg?size=64

# Get SVG with custom dimensions (width x height)
GET /svg/alien-color.svg?size=100x50
```

---

### 6. Get SVG file by unicode

```
GET /svg/unicode/:unicode
```

This endpoint allows you to retrieve SVG files directly using unicode values. It supports both main unicode and skintone variants, plus optional size customization.

**Examples:**

```bash
# Get SVG for 1st place medal (main unicode)
GET /svg/unicode/1f947

# Get SVG with custom size
GET /svg/unicode/1f947?size=32

# Get SVG for artist with light skin tone
GET /svg/unicode/1f9d1 1f3fb 200d 1f3a8

# Get SVG for thumbs up with medium-dark skin tone and custom size
GET /svg/unicode/1f44d 1f3fe?size=48x48
```

**Features:**

- Case-insensitive unicode matching
- Supports skintone variants (unicodeSkintones array)
- Optional size parameter for custom dimensions
- Returns the actual SVG file content
- Returns 404 if unicode not found

**Size Parameter:**

- `size=64` - Sets both width and height to 64px (square)
- `size=100x50` - Sets width to 100px and height to 50px (rectangle)
- Invalid sizes are ignored and original SVG is returned

**Response:**

- Success: SVG file content with appropriate content-type
- Error: `404` with message "Emoji SVG not found for unicode: [unicode]"

---

## ![file_folder](https://fluentemojiapi-production.up.railway.app/svg/1f4c2) Project Structure

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

## ![scroll](https://fluentemojiapi-production.up.railway.app/svg/1f4dc) License

This project is licensed under the [MIT License](LICENSE).
