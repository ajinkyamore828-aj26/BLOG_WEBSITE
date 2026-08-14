// ============================================================
//  BlogVerse — Posts REST API Routes
// ============================================================
const express = require('express');
const router  = express.Router();
const DB      = require('../db');

// GET /api/posts — published posts, supports ?q=&category=&sort=
router.get('/', (req, res) => {
  const { q, category, sort } = req.query;
  let posts = DB.search(q, category);

  if (sort === 'oldest') {
    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'popular') {
    posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  // default: newest (already sorted by DB.search -> getPublished)

  res.json(posts);
});

// GET /api/posts/stats
router.get('/stats', (_req, res) => {
  res.json(DB.getStats());
});

// GET /api/posts/drafts
router.get('/drafts', (_req, res) => {
  res.json(DB.getDrafts());
});

// GET /api/posts/author
router.get('/author', (_req, res) => {
  res.json(DB.AUTHOR);
});

// GET /api/posts/likes — full likes map
router.get('/likes', (_req, res) => {
  res.json(DB.getLikes());
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const post = DB.getById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// POST /api/posts — create or update
router.post('/', (req, res) => {
  const post = req.body;
  if (!post || typeof post !== 'object') {
    return res.status(400).json({ error: 'Invalid post data' });
  }
  const saved = DB.save(post);
  res.json(saved);
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const post = DB.getById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  DB.delete(req.params.id);
  res.json({ success: true });
});

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', (req, res) => {
  const result = DB.toggleLike(req.params.id);
  if (!result) return res.status(404).json({ error: 'Post not found' });
  res.json(result);
});

module.exports = router;
