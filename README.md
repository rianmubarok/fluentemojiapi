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
    "name": "1st-place-medal-color",
    "unicode": null,
    "path": "/svg/1st-place-medal-color.svg"
  },
  {
    "name": "2nd-place-medal-color",
    "unicode": null,
    "path": "/svg/2nd-place-medal-color.svg"
  },
  {
    "name": "3rd-place-medal-color",
    "unicode": null,
    "path": "/svg/3rd-place-medal-color.svg"
  }
]
```

---

### 2. Search emojis by name

```
GET /emojis/search?q=medal
```

**Example response:**

```json
[
  {
    "name": "1st-place-medal-color",
    "unicode": null,
    "path": "/svg/1st-place-medal-color.svg"
  },
  {
    "name": "2nd-place-medal-color",
    "unicode": null,
    "path": "/svg/2nd-place-medal-color.svg"
  }
]
```

---

### 3. Get emoji details by name

```
GET /emojis/:name
```

**Example request:**

```
GET /emojis/1st-place-medal-color
```

**Example response:**

```json
{
  "name": "1st-place-medal-color",
  "unicode": null,
  "path": "/svg/1st-place-medal-color.svg"
}
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
