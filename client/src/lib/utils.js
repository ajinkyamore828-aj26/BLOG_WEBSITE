// ============================================================
//  BlogVerse — Utility Functions (ported from app.js)
// ============================================================

export const CAT_BADGE = {
  Technology: 'badge-sky', Programming: 'badge-blue', Design: 'badge-white',
  Career: 'badge-amber', Tutorial: 'badge-green', Opinion: 'badge-amber',
  Lifestyle: 'badge-white', General: 'badge-sky'
};

export const CAT_EMOJI = {
  Technology: '⚡', Programming: '💻', Design: '🎨', Career: '🚀',
  Tutorial: '📚', Opinion: '💡', Lifestyle: '🌟', General: '📝'
};

export const CATEGORIES = ['All', 'Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Opinion', 'Lifestyle'];

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const dy = Math.floor(h / 24);
  if (dy < 7) return dy + 'd ago';
  return fmtDate(iso);
}

export function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '');
}

export function truncate(s, n = 140) {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export function catBadge(c) {
  return CAT_BADGE[c] || 'badge-sky';
}

export function catEmoji(c) {
  return CAT_EMOJI[c] || '📝';
}

export function genId() {
  return 'post-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
}

export function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
