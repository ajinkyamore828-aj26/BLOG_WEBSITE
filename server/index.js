// ============================================================
//  BlogVerse — Node.js + Express Server
// ============================================================
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const postRoutes = require('./routes/posts');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '10mb' }));  // large body for cover images (base64)

// ── ROUTES ───────────────────────────────────────────────────
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ BlogVerse API running at http://localhost:${PORT}`);
});
