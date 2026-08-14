# BlogVerse — React + Node.js

A personal blogging platform rebuilt with **React** (frontend) and **Node.js + Express** (backend).

## Project Structure

```
blogging-platform/
├── server/          ← Node.js + Express REST API (port 3001)
│   ├── index.js
│   ├── db.js        ← JSON file data store
│   ├── routes/
│   │   └── posts.js
│   └── package.json
├── client/          ← React + Vite frontend (port 5173)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   ├── api.js       ← API client
│   │   │   └── utils.js     ← Utility functions
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ConfirmModal.jsx
│   │   └── pages/
│   │       ├── Home.jsx     ← Feed / Home page
│   │       ├── Post.jsx     ← Single post reader
│   │       └── Editor.jsx   ← Post editor
│   └── package.json
└── assets/
    └── hero_banner.png
```

## Running Locally

### 1. Start the backend (Node.js server)

```bash
cd server
npm install
npm start
# → API running at http://localhost:3001
```

### 2. Start the frontend (React dev server)

```bash
cd client
npm install
npm run dev
# → App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get published posts (supports `?q=&category=&sort=`) |
| GET | `/api/posts/drafts` | Get drafts |
| GET | `/api/posts/stats` | Get statistics |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create / update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Toggle like |

## Features

- ✅ Browse & search published posts
- ✅ Category filtering & sorting  
- ✅ Rich text editor with toolbar
- ✅ Draft saving & autosave
- ✅ Publish posts
- ✅ Like / unlike posts
- ✅ Reading progress bar
- ✅ Table of contents auto-generation
- ✅ Share to Twitter / LinkedIn
- ✅ Related posts
- ✅ Data persisted to `server/db.json`
