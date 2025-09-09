# FluentEmojiAPI

FluentEmojiAPI is a simple and lightweight REST API that serves **Microsoft Fluent Emoji (SVG format)**.  
This project provides endpoints to list, search, and retrieve emoji details.

![grinning_face](https://fluentemojiapi-production.up.railway.app/svg/1f600) ![smiling_face_with_heart_eyes](https://fluentemojiapi-production.up.railway.app/svg/1f60d) ![smiling_face_with_hearts](https://fluentemojiapi-production.up.railway.app/svg/1f970) ![face_blowing_a_kiss](https://fluentemojiapi-production.up.railway.app/svg/1f618) ![smiling_face_with_sunglasses](https://fluentemojiapi-production.up.railway.app/svg/1f60e) ![star_struck](https://fluentemojiapi-production.up.railway.app/svg/1f929) ![face_with_tears_of_joy](https://fluentemojiapi-production.up.railway.app/svg/1f602) ![rolling_on_the_floor_laughing](https://fluentemojiapi-production.up.railway.app/svg/1f923) ![loudly_crying_face](https://fluentemojiapi-production.up.railway.app/svg/1f62d) ![pouting_face](https://fluentemojiapi-production.up.railway.app/svg/1f621) ![face_with_symbols_on_mouth](https://fluentemojiapi-production.up.railway.app/svg/1f92c) ![face_screaming_in_fear](https://fluentemojiapi-production.up.railway.app/svg/1f631) ![exploding_head](https://fluentemojiapi-production.up.railway.app/svg/1f92f) ![flushed_face](https://fluentemojiapi-production.up.railway.app/svg/1f633) ![hot_face](https://fluentemojiapi-production.up.railway.app/svg/1f975) ![thinking_face](https://fluentemojiapi-production.up.railway.app/svg/1f914) ![hugging_face](https://fluentemojiapi-production.up.railway.app/svg/1f917) ![face_with_hand_over_mouth](https://fluentemojiapi-production.up.railway.app/svg/1f92d) ![face_with_rolling_eyes](https://fluentemojiapi-production.up.railway.app/svg/1f644) ![sleeping_face](https://fluentemojiapi-production.up.railway.app/svg/1f634) ![drooling_face](https://fluentemojiapi-production.up.railway.app/svg/1f924) ![nauseated_face](https://fluentemojiapi-production.up.railway.app/svg/1f922) ![face_vomiting](https://fluentemojiapi-production.up.railway.app/svg/1f92e) ![face_with_medical_mask](https://fluentemojiapi-production.up.railway.app/svg/1f637) ![money_mouth_face](https://fluentemojiapi-production.up.railway.app/svg/1f911) ![cowboy_hat_face](https://fluentemojiapi-production.up.railway.app/svg/1f920) ![smiling_face_with_horns](https://fluentemojiapi-production.up.railway.app/svg/1f608) ![angry_face_with_horns](https://fluentemojiapi-production.up.railway.app/svg/1f47f) ![clown_face](https://fluentemojiapi-production.up.railway.app/svg/1f921) ![pile_of_poo](https://fluentemojiapi-production.up.railway.app/svg/1f4a9) ![ghost](https://fluentemojiapi-production.up.railway.app/svg/1f47b) ![skull](https://fluentemojiapi-production.up.railway.app/svg/1f480) ![alien_monster](https://fluentemojiapi-production.up.railway.app/svg/1f47d) ![robot](https://fluentemojiapi-production.up.railway.app/svg/1f916) ![jack_o_lantern](https://fluentemojiapi-production.up.railway.app/svg/1f383)

---

## Features

- Serve Fluent Emoji SVG files.
- JSON endpoint with emoji metadata.
- Search emojis by name, unicode, group, keywords, and more.
- Get SVG files directly by unicode (supports skintone variants).
- Lightweight and easy to deploy (Express.js).

---

## Installation

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
`http://localhost:3000`

---

## API Endpoints

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

### 5. Get SVG file by unicode

```
GET /svg/:unicode
```

This endpoint allows you to retrieve SVG files directly using unicode values. It supports both main unicode and skintone variants.

**Examples:**

```bash
# Get SVG for 1st place medal (main unicode)
GET /svg/1f947

# Get SVG for artist with light skin tone
GET /svg/1f9d1 1f3fb 200d 1f3a8

# Get SVG for thumbs up with medium-dark skin tone
GET /svg/1f44d 1f3fe
```

**Features:**

- Case-insensitive unicode matching
- Supports skintone variants (unicodeSkintones array)
- Returns the actual SVG file content
- Returns 404 if unicode not found

Optional query parameters:

- `size`: set output SVG dimensions. Accepts either a single number (applies to both width and height) or `WIDTHxHEIGHT`.

Examples:

```bash
# Square size
GET /svg/1f947?size=24

# Custom width x height
GET /svg/1f947?size=32x20
```

Note:

- `?size=` is supported only on the `/svg/:unicode` endpoint (not on direct file paths like `/svg/alien-color.svg`).

**Response:**

- Success: SVG file content with appropriate content-type
- Error: `404` with message "Emoji SVG not found for unicode: [unicode]"

---

## Project Structure

```
fluentemojiapi/
├─ api.js              # Main server file
├─ package.json        # Dependencies
├─ data/
│  ├─ index.json       # Emoji metadata
│  └─ svg/             # SVG files
└─ README.md           # Documentation
```

---

## Easily embed in your GitHub README

You can use this API directly in your project README or any Markdown/HTML site.

Markdown example:

```md
![handshake](https://fluentemojiapi-production.up.railway.app/svg/1f91d?size=24)
```

HTML example:

```html
<img
  src="https://fluentemojiapi-production.up.railway.app/svg/1f600?size=32x32"
  alt="grinning face"
/>
```

Replace the unicode with the emoji you need and adjust `?size=` as desired.

## ![handshake](https://fluentemojiapi-production.up.railway.app/svg/1f91d?size=24) Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Help keep FluentEmojiAPI running and continuously improved!

Your support helps with:

- Server hosting costs
- Domain maintenance
- API improvements
- New features development

Every contribution, no matter how small, makes a difference and keeps this API free for everyone to use!

## ![bug](https://fluentemojiapi-production.up.railway.app/svg/1f41b?size=24) Issues

Found a bug or have a feature request? Please open an [issue](https://github.com/rianmubarok/fluentemojiapi/issues) with detailed information.

## ![star](https://fluentemojiapi-production.up.railway.app/svg/2b50?size=24) Support

If this project helps you, please consider giving it a ![star](https://fluentemojiapi-production.up.railway.app/svg/2b50?size=16) on GitHub!

Buy me a mie ayam on ![steaming_bowl](https://fluentemojiapi-production.up.railway.app/svg/1f35c?size=16)

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/rianmubarok)

---

## License

MIT License - see [LICENSE](LICENSE) file for details.
