import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import ConfirmModal from '../components/ConfirmModal';
import { ToastContainer, showToast } from '../components/Toast';
import api from '../lib/api';
import { catEmoji, timeAgo, catBadge, CATEGORIES } from '../lib/utils';

// ── AOS ──────────────────────────────────────────────────────
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('aos-in'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

export default function Home() {
  const navigate = useNavigate();

  // ── STATE ────────────────────────────────────────────────
  const [posts,          setPosts]          = useState([]);
  const [drafts,         setDrafts]         = useState([]);
  const [stats,          setStats]          = useState({ total: 0, drafts: 0, likes: 0, words: 0 });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [sortOrder,      setSortOrder]      = useState('newest');
  const [confirm,        setConfirm]        = useState(null);
  const [animatedStats,  setAnimatedStats]  = useState({ total: 0, drafts: 0, likes: 0, words: 0 });
  const searchTimer = useRef(null);

  // ── DATA LOADING ─────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    const data = await api.getPublished(searchQuery, activeCategory, sortOrder);
    setPosts(data);
    setTimeout(initAOS, 100);
  }, [searchQuery, activeCategory, sortOrder]);

  const loadDrafts = useCallback(async () => {
    const data = await api.getDrafts();
    setDrafts(data);
    setTimeout(initAOS, 100);
  }, []);

  const loadStats = useCallback(async () => {
    const s = await api.getStats();
    setStats(s);
  }, []);

  useEffect(() => {
    loadPosts();
    loadDrafts();
    loadStats();
  }, [loadPosts, loadDrafts, loadStats]);

  // ── ANIMATED STATS ───────────────────────────────────────
  useEffect(() => {
    const keys = ['total', 'drafts', 'likes', 'words'];
    keys.forEach(key => {
      const target = stats[key] || 0;
      let v = 0;
      const step = Math.max(1, target / 50);
      const interval = setInterval(() => {
        v = Math.min(v + step, target);
        setAnimatedStats(prev => ({ ...prev, [key]: Math.round(v) }));
        if (v >= target) clearInterval(interval);
      }, 20);
    });
  }, [stats]);

  // ── SEARCH ───────────────────────────────────────────────
  function handleSearchInput(e) {
    clearTimeout(searchTimer.current);
    const val = e.target.value;
    searchTimer.current = setTimeout(() => setSearchQuery(val.trim()), 250);
  }

  // ── TRENDING ─────────────────────────────────────────────
  const trending = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 7);
  const trendingItems = trending.map(p =>
    <span
      key={p.id}
      className="trending-item"
      onClick={() => navigate(`/post/${p.id}`)}
    >
      {catEmoji(p.category)} {p.title}
    </span>
  );

  // ── CATEGORY TABS ────────────────────────────────────────
  const usedCats = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  // ── POPULAR SIDEBAR ──────────────────────────────────────
  const popular = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);

  // ── CATEGORY COUNTS ──────────────────────────────────────
  const catCounts = {};
  posts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  // ── DELETE DRAFT ─────────────────────────────────────────
  function deleteDraft(id) {
    setConfirm({
      title: 'Delete Draft', body: 'Delete this draft permanently?',
      confirmText: 'Delete', cancelText: 'Keep', danger: true,
      onConfirm: async () => {
        await api.delete(id);
        showToast('Draft deleted', 'info');
        loadDrafts();
        loadStats();
        setConfirm(null);
      }
    });
  }

  return (
    <>
      <Navbar />
      <ToastContainer />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-content fade-in-up">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Personal Blog by Ajinkya More
          </div>
          <h1 className="hero-title">Ideas Worth<br />Reading &amp; Writing</h1>
          <p className="hero-subtitle">
            Thoughts on technology, programming, design, and the journey of building things. Written by{' '}
            <strong style={{ color: 'var(--blue-300)' }}>Ajinkya More</strong>.
          </p>
          <div className="hero-actions">
            <Link to="/editor" className="btn btn-primary btn-lg">✏️ Write a Post</Link>
            <a href="#feed" className="btn btn-secondary btn-lg">📖 Browse Posts</a>
          </div>
        </div>
      </section>

      {/* Trending Strip */}
      <div className="trending-strip">
        <span className="trending-label">🔥 Trending</span>
        <div className="trending-track">
          {trendingItems}{trendingItems}
        </div>
      </div>

      {/* Stats */}
      <div className="page-wrap">
        <div className="stats-banner">
          <div className="stat-box"><span className="stat-num" id="s-posts">{animatedStats.total.toLocaleString()}</span><span className="stat-label">Published Posts</span></div>
          <div className="stat-box"><span className="stat-num" id="s-drafts">{animatedStats.drafts.toLocaleString()}</span><span className="stat-label">Drafts</span></div>
          <div className="stat-box"><span className="stat-num" id="s-likes">{animatedStats.likes.toLocaleString()}</span><span className="stat-label">Total Likes</span></div>
          <div className="stat-box"><span className="stat-num" id="s-words">{animatedStats.words.toLocaleString()}</span><span className="stat-label">Words Written</span></div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout" id="feed">
        {/* Feed */}
        <main>
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="search-input"
                className="search-input"
                placeholder="Search posts…"
                autoComplete="off"
                onChange={handleSearchInput}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="cat-tabs" style={{ marginBottom: '1.25rem' }}>
            {usedCats.map(c => (
              <button
                key={c}
                className={`cat-tab ${c === activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Results row */}
          <div className="results-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="results-count" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </span>
            <select
              id="sort-sel"
              className="sort-select"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Liked</option>
            </select>
          </div>

          {/* Posts Grid */}
          <div className="posts-grid" id="posts-grid">
            {posts.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <span className="empty-state-icon">🔍</span>
                <h3>No posts found</h3>
                <p>Try a different search or category.</p>
                <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear filters</button>
              </div>
            ) : (
              posts.map(p => <PostCard key={p.id} post={p} />)
            )}
          </div>

          {/* Drafts */}
          <div id="drafts-section" style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📝 My Drafts</h2>
              <Link to="/editor" className="btn btn-secondary btn-sm">+ New Post</Link>
            </div>
            <div id="drafts-list">
              {drafts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No drafts yet. <Link to="/editor" style={{ color: 'var(--blue-300)' }}>Start writing!</Link>
                </div>
              ) : (
                drafts.map(p => (
                  <div key={p.id} className="draft-item" data-aos="">
                    <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/editor?id=${p.id}`)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                        <span className="draft-badge">Draft</span>
                      </div>
                      <div className="draft-item-title">{p.title || 'Untitled Post'}</div>
                      <div className="draft-item-meta">Last edited {timeAgo(p.updatedAt)}</div>
                    </div>
                    <div className="draft-item-actions">
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/editor?id=${p.id}`); }}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); deleteDraft(p.id); }}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside>
          <div className="sidebar-sticky">
            {/* Author */}
            <div className="sidebar-card" data-aos="">
              <div className="author-card-avatar">AM</div>
              <div className="author-card-name">Ajinkya More</div>
              <p className="author-card-bio">Passionate developer sharing knowledge through code and words.</p>
              <a href="https://www.linkedin.com/in/ajinkya-more-48932940b" target="_blank" rel="noopener noreferrer" className="social-btn">🔗 LinkedIn</a>
              <a href="https://github.com/ajinkyamore828-aj26" target="_blank" rel="noopener noreferrer" className="social-btn">🐙 GitHub</a>
            </div>

            {/* Popular */}
            <div className="sidebar-card" data-aos="">
              <div className="sidebar-title">🏆 Most Liked</div>
              <div id="popular-list">
                {popular.map((p, i) => (
                  <div key={p.id} className="pop-item" onClick={() => navigate(`/post/${p.id}`)}>
                    <span className="pop-num">0{i + 1}</span>
                    <div>
                      <div className="pop-title">{p.title}</div>
                      <div className="pop-meta">❤️ {p.likes || 0} · {p.readTime || 1}m read</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-card" data-aos="">
              <div className="sidebar-title">📂 Categories</div>
              <div id="cats-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(catCounts).map(([cat, count]) => (
                  <button
                    key={cat}
                    className="cat-tab"
                    style={{ display: 'flex', justifyContent: 'space-between', borderRadius: 'var(--r-sm)' }}
                    onClick={() => { setActiveCategory(cat); document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    <span>{catEmoji(cat)} {cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">BlogVerse ✍</div>
        <p className="footer-tagline">Crafted with ❤️ by Ajinkya More</p>
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/editor" className="footer-link">Write</Link>
          <a href="https://www.linkedin.com/in/ajinkya-more-48932940b" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="https://github.com/ajinkyamore828-aj26" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        </div>
        <p className="footer-copy">© 2025 BlogVerse by Ajinkya More · React &amp; Node.js</p>
      </footer>

      {/* Confirm Modal */}
      {confirm && (
        <ConfirmModal
          isOpen={!!confirm}
          title={confirm.title}
          body={confirm.body}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <style>{`
        .trending-strip { background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 0.6rem 2rem; display: flex; align-items: center; gap: 1rem; overflow: hidden; }
        .trending-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--blue-300); white-space: nowrap; flex-shrink: 0; }
        .trending-track { display: flex; gap: 2rem; white-space: nowrap; animation: ticker 35s linear infinite; }
        .trending-track:hover { animation-play-state: paused; }
        .trending-item { font-size: 0.8rem; color: var(--text-secondary); cursor: pointer; transition: var(--t); flex-shrink: 0; }
        .trending-item:hover { color: var(--blue-300); }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      `}</style>
    </>
  );
}
