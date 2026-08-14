// ============================================================
//  BlogVerse — API Client (replaces localStorage DB calls)
//  All methods mirror the original DB object from app.js
// ============================================================

const API = '/api';

// Likes are tracked per-browser in localStorage (server is source of truth for counts)
const LIKES_KEY = 'blogverse_likes_v2';

function getLikesMap() {
  try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); }
  catch (e) { return {}; }
}
function setLikesMap(map) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(map));
}

const api = {
  // ── POSTS ────────────────────────────────────────────────
  async getPublished(query = '', category = 'All', sort = 'newest') {
    const params = new URLSearchParams();
    if (query)    params.set('q', query);
    if (category && category !== 'All') params.set('category', category);
    if (sort)     params.set('sort', sort);
    const res = await fetch(`${API}/posts?${params}`);
    return res.json();
  },

  async getDrafts() {
    const res = await fetch(`${API}/posts/drafts`);
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API}/posts/stats`);
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API}/posts/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async save(post) {
    const res = await fetch(`${API}/posts`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(post)
    });
    return res.json();
  },

  async delete(id) {
    await fetch(`${API}/posts/${id}`, { method: 'DELETE' });
  },

  async toggleLike(id) {
    const res = await fetch(`${API}/posts/${id}/like`, { method: 'POST' });
    const result = await res.json();

    // Mirror like state in localStorage for hasLiked()
    const map = getLikesMap();
    if (result.liked) map[id] = true;
    else              delete map[id];
    setLikesMap(map);

    return result;
  },

  hasLiked(id) {
    return !!getLikesMap()[id];
  },

  // ── AUTHOR ───────────────────────────────────────────────
  async getAuthor() {
    const res = await fetch(`${API}/posts/author`);
    return res.json();
  },

  // ── AUTOSAVE (still localStorage — no server needed) ─────
  autosave(data) {
    localStorage.setItem('blogverse_autosave', JSON.stringify({ ...data, _savedAt: Date.now() }));
  },
  loadAutosave() {
    try { return JSON.parse(localStorage.getItem('blogverse_autosave') || 'null'); }
    catch (e) { return null; }
  },
  clearAutosave() {
    localStorage.removeItem('blogverse_autosave');
  },

  // ── HELPERS ──────────────────────────────────────────────
  calcReadTime(html) {
    const words = (html || '').replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
};

export default api;
