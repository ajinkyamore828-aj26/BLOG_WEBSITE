import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import ConfirmModal from '../components/ConfirmModal';
import { ToastContainer, showToast } from '../components/Toast';
import api from '../lib/api';
import { fmtDate, catBadge, catEmoji } from '../lib/utils';

const AUTHOR = {
  name:     'Ajinkya More',
  initials: 'AM',
  bio:      'Passionate developer & writer. Sharing knowledge through code and words.',
  linkedin: 'https://www.linkedin.com/in/ajinkya-more-48932940b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  github:   'https://github.com/ajinkyamore828-aj26'
};

// Build Table of Contents from HTML string
function buildTOC(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const headings = div.querySelectorAll('h2, h3');
  if (headings.length < 2) return null;
  return Array.from(headings).map((h, i) => ({ id: `sec-${i}`, text: h.textContent }));
}

export default function Post() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [post,       setPost]       = useState(null);
  const [related,    setRelated]    = useState([]);
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [likeHint,   setLikeHint]   = useState('Click to like');
  const [progress,   setProgress]   = useState(0);
  const [showTop,    setShowTop]    = useState(false);
  const [confirm,    setConfirm]    = useState(null);
  const [toc,        setToc]        = useState(null);
  const [notFound,   setNotFound]   = useState(false);
  const bodyRef = useRef(null);

  // ── READING PROGRESS ────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (scrollTop / docH * 100) : 0);
      setShowTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── ADD IDS TO HEADINGS FOR TOC LINKS ────────────────────
  useEffect(() => {
    if (!bodyRef.current || !toc) return;
    const headings = bodyRef.current.querySelectorAll('h2, h3');
    headings.forEach((h, i) => { h.id = `sec-${i}`; });
  }, [toc, post]);

  // ── LOAD POST ────────────────────────────────────────────
  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    (async () => {
      const p = await api.getById(id);
      if (!p) { setNotFound(true); return; }
      setPost(p);
      setLiked(api.hasLiked(id));
      setLikeCount(p.likes || 0);
      setLikeHint(api.hasLiked(id) ? 'Click to unlike' : 'Click to like');
      document.title = `${p.title} — BlogVerse`;
      setToc(buildTOC(p.body || ''));

      // Load related
      const all = await api.getPublished();
      const sameCat = all.filter(r => r.id !== p.id && r.category === p.category).slice(0, 3);
      const rest    = all.filter(r => r.id !== p.id && r.category !== p.category);
      setRelated([...sameCat, ...rest].slice(0, 3));
    })();
  }, [id]);

  // ── LIKE ─────────────────────────────────────────────────
  async function doLike() {
    if (!post) return;
    const res = await api.toggleLike(post.id);
    setLiked(res.liked);
    setLikeCount(res.count);
    setLikeHint(res.liked ? 'Click to unlike' : 'Click to like');
    showToast(res.liked ? '❤️ Liked!' : 'Like removed', res.liked ? 'success' : 'info');
  }

  // ── COPY LINK ────────────────────────────────────────────
  function copyLink() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success')).catch(() => fallbackCopy(url));
    } else fallbackCopy(url);
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); showToast('Link copied!', 'success'); }
    catch (e) { showToast('Could not copy', 'error'); }
    document.body.removeChild(ta);
  }

  // ── DELETE ───────────────────────────────────────────────
  function doDelete() {
    setConfirm({
      title: 'Delete Post', body: 'Permanently delete this post? This cannot be undone.',
      confirmText: 'Delete', cancelText: 'Cancel', danger: true,
      onConfirm: async () => {
        await api.delete(post.id);
        showToast('Post deleted', 'info');
        setTimeout(() => navigate('/'), 700);
        setConfirm(null);
      }
    });
  }

  // ── NOT FOUND ────────────────────────────────────────────
  if (notFound) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem', paddingTop: '86px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📭</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }}>Post Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This post doesn't exist or was deleted.</p>
          <Link to="/" className="btn btn-primary">← Back to Home</Link>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', paddingTop: '86px', color: 'var(--text-muted)' }}>
          Loading…
        </div>
      </>
    );
  }

  const tags = post.tags || [];

  return (
    <>
      {/* Reading progress */}
      <div id="reading-progress" style={{ width: `${progress}%` }} />

      <Navbar
        actions={
          <>
            <Link to={`/editor?id=${post.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
            <Link to="/editor" className="btn btn-primary btn-sm">✏️ New Post</Link>
          </>
        }
      />
      <ToastContainer />

      <div className="post-page" id="post-root">
        {/* Hero */}
        <div className="post-hero">
          {post.coverImage ? (
            <>
              <img src={post.coverImage} alt={post.title} className="post-hero-img" />
              <div className="post-hero-overlay" />
            </>
          ) : (
            <div className="post-hero-placeholder">{catEmoji(post.category)}</div>
          )}
          <div className="post-hero-content">
            <span className={`badge ${catBadge(post.category)}`} style={{ marginBottom: '.75rem' }}>{post.category}</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem,4vw,2.8rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '.5rem' }}>{post.title}</h1>
            {post.excerpt && <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '620px' }}>{post.excerpt}</p>}
          </div>
        </div>

        {/* Body wrap */}
        <div className="post-body-wrap">
          {/* Meta bar */}
          <div className="post-meta-bar">
            <div className="author-row">
              <div className="author-av">AM</div>
              <div>
                <div className="author-name">{AUTHOR.name}</div>
                <div className="author-date">{fmtDate(post.createdAt)} · {post.readTime || 1} min read</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={copyLink}>🔗 Share</button>
              <Link to={`/editor?id=${post.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={doDelete}>🗑️ Delete</button>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {tags.map(t => <span key={t} className="badge badge-blue">#{t}</span>)}
            </div>
          )}

          {/* TOC */}
          {toc && (
            <div className="toc">
              <div className="toc-title">📋 Contents</div>
              <ul className="toc-list">
                {toc.map(item => (
                  <li key={item.id} className="toc-list">
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body */}
          <div
            className="post-body"
            id="post-body"
            ref={bodyRef}
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Share bar */}
          <div className="share-bar">
            <span className="share-label">Share:</span>
            <button className="share-btn" onClick={copyLink}>🔗 Copy Link</button>
            <a className="share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">𝕏 Twitter</a>
            <a className="share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a>
          </div>

          {/* Like */}
          <div className="like-wrap">
            <button
              className={`like-btn-big ${liked ? 'liked' : ''}`}
              id="like-btn"
              onClick={doLike}
              style={{ animation: 'none' }}
            >
              {liked ? '❤️' : '🤍'}
            </button>
            <div className="like-num" id="like-num">{likeCount}</div>
            <div className="like-hint" id="like-hint">{likeHint}</div>
          </div>

          {/* Author box */}
          <div className="author-box">
            <div className="author-box-av">{AUTHOR.initials}</div>
            <div>
              <div className="author-box-name">{AUTHOR.name}</div>
              <div className="author-box-bio">{AUTHOR.bio}</div>
              <div className="author-box-links">
                <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer" className="author-soc">🔗 LinkedIn</a>
                <a href={AUTHOR.github}   target="_blank" rel="noopener noreferrer" className="author-soc">🐙 GitHub</a>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section" id="related-section">
            <div style={{ maxWidth: '880px', margin: '0 auto' }}>
              <h2 className="section-title">More Posts</h2>
              <div className="related-grid" id="related-grid">
                {related.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <div className="footer-logo">BlogVerse ✍</div>
          <p className="footer-tagline">Crafted with ❤️ by Ajinkya More</p>
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/editor" className="footer-link">Write</Link>
            <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href={AUTHOR.github}   target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          </div>
          <p className="footer-copy">© 2025 BlogVerse by Ajinkya More</p>
        </footer>
      </div>

      {/* Back to top */}
      <button
        id="back-to-top"
        className={showTop ? 'show' : ''}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >↑</button>

      {/* Confirm Modal */}
      {confirm && (
        <ConfirmModal
          isOpen
          title={confirm.title}
          body={confirm.body}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          danger={confirm.danger}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
