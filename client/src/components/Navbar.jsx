import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ actions }) {
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handler = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className="navbar" ref={navRef} id="navbar">
      <Link to="/" className="nav-logo">
        <span className="nav-logo-icon">✍</span>
        BlogVerse
      </Link>

      <div className="nav-links">
        <Link to="/"        className={`nav-link ${isHome ? 'active' : ''}`}>Home</Link>
        {isHome && <a href="#drafts-section" className="nav-link">Drafts</a>}
        {!isHome && <Link to="/" className="nav-link">← Back to Feed</Link>}
      </div>

      <div className="nav-actions">
        {actions}
        {isHome && (
          <Link to="/editor" className="btn btn-primary">✏️ Write Post</Link>
        )}
      </div>
    </nav>
  );
}
