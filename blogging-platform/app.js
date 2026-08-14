// ============================================================
//  BlogVerse — Core App (Fixed & Stable)
//  Author: Ajinkya More
// ============================================================

const DB_KEY    = 'blogverse_posts';
const LIKES_KEY = 'blogverse_likes';
const DRAFT_KEY = 'blogverse_autosave';

// ── AUTHOR ───────────────────────────────────────────────────
const AUTHOR = {
  name:     'Ajinkya More',
  initials: 'AM',
  bio:      'Passionate developer & writer. Sharing knowledge through code and words.',
  linkedin: 'https://www.linkedin.com/in/ajinkya-more-48932940b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  github:   'https://github.com/ajinkyamore828-aj26'
};

// ── CATEGORIES ───────────────────────────────────────────────
const CATEGORIES = ['All','Technology','Programming','Design','Career','Tutorial','Opinion','Lifestyle'];

const CAT_BADGE = {
  Technology:'badge-sky', Programming:'badge-blue', Design:'badge-white',
  Career:'badge-amber', Tutorial:'badge-green', Opinion:'badge-amber',
  Lifestyle:'badge-white', General:'badge-sky'
};
const CAT_EMOJI = {
  Technology:'⚡', Programming:'💻', Design:'🎨', Career:'🚀',
  Tutorial:'📚', Opinion:'💡', Lifestyle:'🌟', General:'📝'
};

// ── SEED DATA ────────────────────────────────────────────────
const SEED = [
  {
    id:'seed-1', title:'The Future of Web Development: What to Expect in 2025',
    excerpt:'From AI-assisted coding to WebAssembly going mainstream — the trends shaping the web.',
    body:`<h2>The Web is Evolving Fast</h2><p>Web development is changing at an unprecedented pace. From the rise of AI-powered coding tools to the growing adoption of edge computing, the landscape is shifting dramatically.</p><h2>AI-Assisted Development</h2><p>Tools like GitHub Copilot and Cursor have fundamentally changed how developers write code. These tools understand <em>intent</em> and can generate entire components and debug complex issues.</p><blockquote>The best developers in 2025 aren't those who type fastest — they collaborate with AI most effectively.</blockquote><h2>WebAssembly Goes Mainstream</h2><p>WebAssembly (WASM) has been promising for years, but 2025 is the year it goes truly mainstream. We're seeing entire applications compiled to WASM running in browsers at near-native speed.</p><h2>Edge Computing Revolution</h2><p>The edge is no longer a buzzword. Platforms like Cloudflare Workers and Vercel Edge Functions make it trivially easy to run server-side logic milliseconds from your users.</p>`,
    category:'Technology', tags:['webdev','future','AI','WASM'], coverImage:'',
    status:'published', likes:42, readTime:5,
    createdAt:new Date(Date.now()-86400000*3).toISOString(), updatedAt:new Date(Date.now()-86400000*3).toISOString()
  },
  {
    id:'seed-2', title:'Mastering JavaScript Closures: A Deep Dive',
    excerpt:"Closures are one of the most powerful and misunderstood features of JavaScript. Let's break them down.",
    body:`<h2>What is a Closure?</h2><p>A closure is a function that retains access to its outer scope even after that scope has finished executing. This is fundamental to JavaScript.</p><pre><code>function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2</code></pre><h2>Why Do Closures Matter?</h2><p>Closures are everywhere in JavaScript — callbacks, event handlers, module patterns. Every time you write a callback or use setTimeout, you're using closures.</p><h2>The Module Pattern</h2><pre><code>const bank = (function() {
  let balance = 0;
  return {
    deposit(n)  { balance += n; },
    withdraw(n) { balance -= n; },
    balance()   { return balance; }
  };
})();</code></pre><p>This uses closures to create <strong>private state</strong> — essential for encapsulation.</p>`,
    category:'Programming', tags:['javascript','closures','advanced'], coverImage:'',
    status:'published', likes:87, readTime:7,
    createdAt:new Date(Date.now()-86400000*7).toISOString(), updatedAt:new Date(Date.now()-86400000*7).toISOString()
  },
  {
    id:'seed-3', title:'Design Systems: Why Every Team Needs One',
    excerpt:"A design system isn't just a component library — it's a shared language between design and dev.",
    body:`<h2>The Problem With Ad-Hoc Design</h2><p>Without a design system, teams end up with dozens of slightly different buttons, inconsistent spacing, and colours that "look almost the same." This is design debt.</p><h2>What Makes a Great Design System</h2><ul><li><strong>Design Tokens</strong> — Primitive values (colours, spacing, typography)</li><li><strong>Components</strong> — Reusable UI elements built on those tokens</li><li><strong>Documentation</strong> — Clear guidelines on when and how to use each component</li></ul><h2>The ROI</h2><p>Teams with design systems report faster development velocity, fewer bugs, and more cohesive user experiences. The investment pays off quickly.</p>`,
    category:'Design', tags:['design','systems','UI','UX'], coverImage:'',
    status:'published', likes:31, readTime:4,
    createdAt:new Date(Date.now()-86400000*14).toISOString(), updatedAt:new Date(Date.now()-86400000*14).toISOString()
  },
  {
    id:'seed-4', title:'From Junior to Senior: 5 Years of Lessons',
    excerpt:'Technical skills matter, but mindset shifts and soft skills truly accelerate your career.',
    body:`<h2>Year 1: Imposter Syndrome is Normal</h2><p>Every developer feels like a fraud sometimes. Focus on learning, not on appearing competent.</p><h2>Year 2: Code Quality Matters</h2><p>Writing code that works is table stakes. Writing code that's readable and maintainable separates good from great developers.</p><blockquote>Any fool can write code a computer understands. Good programmers write code humans understand. — Martin Fowler</blockquote><h2>Year 3: Communication is a Superpower</h2><p>Explaining technical concepts to non-technical stakeholders is incredibly valuable. Invest in this skill early.</p><h2>Year 4: Learn System Design</h2><p>Understanding databases, caching, message queues, and APIs is what makes you a force multiplier.</p><h2>Year 5: Mentor Others</h2><p>Teaching is the best way to solidify your own knowledge. Find someone junior and help them grow.</p>`,
    category:'Career', tags:['career','growth','engineering'], coverImage:'',
    status:'published', likes:156, readTime:6,
    createdAt:new Date(Date.now()-86400000*21).toISOString(), updatedAt:new Date(Date.now()-86400000*21).toISOString()
  },
  {
    id:'seed-5', title:'Build a REST API with Node.js in 30 Minutes',
    excerpt:'Step-by-step: create a production-ready REST API using Node.js, Express, and best practices.',
    body:`<h2>Prerequisites</h2><p>You need Node.js 18+ and basic JavaScript knowledge. That's it!</p><h2>Setting Up</h2><pre><code>mkdir my-api && cd my-api
npm init -y
npm install express cors helmet morgan</code></pre><h2>Creating the Server</h2><pre><code>const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(3000, () => console.log('Server on :3000'));</code></pre><h2>Adding Routes</h2><p>Organise routes in separate files to keep the codebase clean as it grows. Use <code>express.Router()</code> for modular routing.</p>`,
    category:'Tutorial', tags:['nodejs','API','backend'], coverImage:'',
    status:'published', likes:73, readTime:8,
    createdAt:new Date(Date.now()-86400000*5).toISOString(), updatedAt:new Date(Date.now()-86400000*5).toISOString()
  }
];

// ── DATABASE LAYER (no 'this' — references DB directly) ──────
const DB = {
  init() {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(SEED));
    }
    if (!localStorage.getItem(LIKES_KEY)) {
      localStorage.setItem(LIKES_KEY, JSON.stringify({}));
    }
  },

  getAll() {
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); }
    catch(e) { return []; }
  },

  saveAll(posts) {
    localStorage.setItem(DB_KEY, JSON.stringify(posts));
  },

  getPublished() {
    return DB.getAll()
      .filter(p => p.status === 'published')
      .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getDrafts() {
    return DB.getAll()
      .filter(p => p.status === 'draft')
      .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getById(id) {
    return DB.getAll().find(p => p.id === id) || null;
  },

  save(post) {
    if (!post.id) { post.id = 'post-' + Date.now(); }
    const posts = DB.getAll();
    const idx   = posts.findIndex(p => p.id === post.id);
    const now   = new Date().toISOString();

    if (idx >= 0) {
      posts[idx] = Object.assign({}, posts[idx], post, { updatedAt: now });
    } else {
      const newPost = Object.assign({
        likes: 0,
        readTime: DB.calcReadTime(post.body || ''),
        createdAt: now,
        updatedAt: now
      }, post);
      posts.unshift(newPost);
    }
    DB.saveAll(posts);
    return posts[idx >= 0 ? idx : 0];
  },

  delete(id) {
    DB.saveAll(DB.getAll().filter(p => p.id !== id));
  },

  calcReadTime(html) {
    const words = (html || '').replace(/<[^>]+>/g,'').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  },

  // Likes
  getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); }
    catch(e) { return {}; }
  },

  hasLiked(id) {
    return !!DB.getLikes()[id];
  },

  toggleLike(id) {
    const post = DB.getById(id);
    if (!post) return null;
    const likes = DB.getLikes();
    const wasLiked = !!likes[id];
    if (wasLiked) {
      delete likes[id];
      post.likes = Math.max(0, (post.likes || 0) - 1);
    } else {
      likes[id] = true;
      post.likes = (post.likes || 0) + 1;
    }
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    DB.save(post);
    return { liked: !wasLiked, count: post.likes };
  },

  // Autosave
  autosave(data) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(Object.assign({}, data, { _savedAt: Date.now() })));
  },
  loadAutosave() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); }
    catch(e) { return null; }
  },
  clearAutosave() { localStorage.removeItem(DRAFT_KEY); },

  // Search
  search(query, category) {
    const q = (query || '').toLowerCase().trim();
    return DB.getPublished().filter(p => {
      const inCat = !category || category === 'All' || p.category === category;
      if (!q) return inCat;
      const haystack = [p.title, p.excerpt, p.category, ...(p.tags||[])].join(' ').toLowerCase();
      return inCat && haystack.includes(q);
    });
  },

  getStats() {
    const all  = DB.getAll();
    const pub  = all.filter(p => p.status === 'published');
    const draft= all.filter(p => p.status === 'draft');
    const likes= pub.reduce((s,p)=> s+(p.likes||0), 0);
    const words= pub.reduce((s,p)=> s+(p.body||'').replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length, 0);
    return { total: pub.length, drafts: draft.length, likes, words };
  }
};

// ── UTILITIES ────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
}
function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d/60000);
  if (m < 1)  return 'just now';
  if (m < 60) return m+'m ago';
  const h = Math.floor(m/60);
  if (h < 24) return h+'h ago';
  const dy = Math.floor(h/24);
  if (dy < 7) return dy+'d ago';
  return fmtDate(iso);
}
function stripHtml(html) { return (html||'').replace(/<[^>]+>/g,''); }
function truncate(s,n=140) { return s.length>n ? s.slice(0,n)+'…' : s; }
function catBadge(c) { return CAT_BADGE[c] || 'badge-sky'; }
function catEmoji(c) { return CAT_EMOJI[c] || '📝'; }
function genId() { return 'post-'+Date.now()+'-'+Math.random().toString(36).slice(2,7); }

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg, type='info') {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const t = document.createElement('div');
  t.className = 'toast toast-'+type;
  t.innerHTML = '<span>'+icons[type]+'</span><span>'+msg+'</span>';
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),350); }, 3000);
}

// ── MODAL ────────────────────────────────────────────────────
function showConfirm({ title, body, confirmText='Confirm', cancelText='Cancel', danger=false, onConfirm }) {
  let bg = document.getElementById('g-modal');
  if (!bg) {
    bg = document.createElement('div');
    bg.id = 'g-modal';
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal-box">
      <h3 class="modal-title" id="gm-title"></h3>
      <p class="modal-body-text" id="gm-body"></p>
      <div class="modal-foot">
        <button class="btn btn-secondary" id="gm-cancel"></button>
        <button class="btn" id="gm-confirm"></button>
      </div>
    </div>`;
    document.body.appendChild(bg);
    bg.addEventListener('click', e => { if(e.target===bg) closeModal(); });
  }
  document.getElementById('gm-title').textContent = title;
  document.getElementById('gm-body').textContent  = body;
  const ok = document.getElementById('gm-confirm');
  const no = document.getElementById('gm-cancel');
  ok.textContent = confirmText;
  ok.className   = 'btn '+(danger?'btn-danger':'btn-primary');
  no.textContent = cancelText;
  ok.onclick = ()=>{ if(onConfirm) onConfirm(); closeModal(); };
  no.onclick = closeModal;
  requestAnimationFrame(()=> bg.classList.add('open'));
}
function closeModal() {
  const m = document.getElementById('g-modal');
  if (m) m.classList.remove('open');
}

// ── AOS (animate on scroll) ───────────────────────────────────
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=> e.target.classList.add('aos-in'), i*60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// ── NAVBAR SCROLL ─────────────────────────────────────────────
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll',()=> nav.classList.toggle('scrolled', window.scrollY>20), {passive:true});
}

// ── RENDER POST CARD ──────────────────────────────────────────
function renderCard(post) {
  const excerpt  = post.excerpt || truncate(stripHtml(post.body||''), 130);
  const coverHtml= post.coverImage
    ? `<div class="post-card-cover-wrap"><img src="${post.coverImage}" alt="${escHtml(post.title)}" class="post-card-cover" loading="lazy" onerror="this.parentNode.innerHTML='<div class=post-card-placeholder>${catEmoji(post.category)}</div>'"></div>`
    : `<div class="post-card-placeholder">${catEmoji(post.category)}</div>`;
  const tagsHtml = (post.tags||[]).slice(0,2).map(t=>`<span class="badge badge-blue">#${escHtml(t)}</span>`).join('');
  return `<div class="post-card" onclick="window.location.href='post.html?id=${post.id}'">
    ${coverHtml}
    <div class="post-card-body">
      <div class="post-card-meta">
        <span class="badge ${catBadge(post.category)}">${escHtml(post.category)}</span>
        <span>·</span><span>${post.readTime||1} min read</span>
        <span>·</span><span>${timeAgo(post.createdAt)}</span>
      </div>
      <h3 class="post-card-title">${escHtml(post.title)}</h3>
      <p class="post-card-excerpt">${escHtml(excerpt)}</p>
      <div class="post-card-footer">
        <div class="post-card-tags">${tagsHtml}</div>
        <div class="post-card-stats">
          <span>❤️ ${post.likes||0}</span>
          <span>📖 ${post.readTime||1}m</span>
        </div>
      </div>
    </div>
  </div>`;
}

function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderAuthorBox() {
  return `<div class="author-box">
    <div class="author-box-av">${AUTHOR.initials}</div>
    <div>
      <div class="author-box-name">${AUTHOR.name}</div>
      <div class="author-box-bio">${AUTHOR.bio}</div>
      <div class="author-box-links">
        <a href="${AUTHOR.linkedin}" target="_blank" rel="noopener" class="author-soc">🔗 LinkedIn</a>
        <a href="${AUTHOR.github}"   target="_blank" rel="noopener" class="author-soc">🐙 GitHub</a>
      </div>
    </div>
  </div>`;
}

// ── EXPORT ───────────────────────────────────────────────────
window.BV = {
  DB, AUTHOR, CATEGORIES, CAT_BADGE, CAT_EMOJI,
  fmtDate, timeAgo, stripHtml, truncate, catBadge, catEmoji, genId, escHtml,
  showToast, showConfirm, closeModal, initAOS, initNavbar, renderCard, renderAuthorBox
};
