// ============================================================
//  BlogVerse — Data Layer (JSON file persistence)
//  Mirrors the original localStorage DB object from app.js
// ============================================================
const fs   = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// ── AUTHOR ───────────────────────────────────────────────────
const AUTHOR = {
  name:     'Ajinkya More',
  initials: 'AM',
  bio:      'Passionate developer & writer. Sharing knowledge through code and words.',
  linkedin: 'https://www.linkedin.com/in/ajinkya-more-48932940b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  github:   'https://github.com/ajinkyamore828-aj26'
};

// ── SEED DATA ────────────────────────────────────────────────
const SEED = [
  {
    id: 'seed-1',
    title: 'The Future of Web Development: What to Expect in 2025',
    excerpt: 'From AI-assisted coding to WebAssembly going mainstream — the trends shaping the web.',
    body: `<h2>The Web is Evolving Fast</h2><p>Web development is changing at an unprecedented pace. From the rise of AI-powered coding tools to the growing adoption of edge computing, the landscape is shifting dramatically.</p><h2>AI-Assisted Development</h2><p>Tools like GitHub Copilot and Cursor have fundamentally changed how developers write code. These tools understand <em>intent</em> and can generate entire components and debug complex issues.</p><blockquote>The best developers in 2025 aren't those who type fastest — they collaborate with AI most effectively.</blockquote><h2>WebAssembly Goes Mainstream</h2><p>WebAssembly (WASM) has been promising for years, but 2025 is the year it goes truly mainstream. We're seeing entire applications compiled to WASM running in browsers at near-native speed.</p><h2>Edge Computing Revolution</h2><p>The edge is no longer a buzzword. Platforms like Cloudflare Workers and Vercel Edge Functions make it trivially easy to run server-side logic milliseconds from your users.</p>`,
    category: 'Technology', tags: ['webdev', 'future', 'AI', 'WASM'], coverImage: '',
    status: 'published', likes: 42, readTime: 5,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'seed-2',
    title: 'Mastering JavaScript Closures: A Deep Dive',
    excerpt: "Closures are one of the most powerful and misunderstood features of JavaScript. Let's break them down.",
    body: `<h2>What is a Closure?</h2><p>A closure is a function that retains access to its outer scope even after that scope has finished executing. This is fundamental to JavaScript.</p><pre><code>function makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2</code></pre><h2>Why Do Closures Matter?</h2><p>Closures are everywhere in JavaScript — callbacks, event handlers, module patterns. Every time you write a callback or use setTimeout, you're using closures.</p><h2>The Module Pattern</h2><pre><code>const bank = (function() {\n  let balance = 0;\n  return {\n    deposit(n)  { balance += n; },\n    withdraw(n) { balance -= n; },\n    balance()   { return balance; }\n  };\n})();</code></pre><p>This uses closures to create <strong>private state</strong> — essential for encapsulation.</p>`,
    category: 'Programming', tags: ['javascript', 'closures', 'advanced'], coverImage: '',
    status: 'published', likes: 87, readTime: 7,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'seed-3',
    title: 'Design Systems: Why Every Team Needs One',
    excerpt: "A design system isn't just a component library — it's a shared language between design and dev.",
    body: `<h2>The Problem With Ad-Hoc Design</h2><p>Without a design system, teams end up with dozens of slightly different buttons, inconsistent spacing, and colours that "look almost the same." This is design debt.</p><h2>What Makes a Great Design System</h2><ul><li><strong>Design Tokens</strong> — Primitive values (colours, spacing, typography)</li><li><strong>Components</strong> — Reusable UI elements built on those tokens</li><li><strong>Documentation</strong> — Clear guidelines on when and how to use each component</li></ul><h2>The ROI</h2><p>Teams with design systems report faster development velocity, fewer bugs, and more cohesive user experiences. The investment pays off quickly.</p>`,
    category: 'Design', tags: ['design', 'systems', 'UI', 'UX'], coverImage: '',
    status: 'published', likes: 31, readTime: 4,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 'seed-4',
    title: 'From Junior to Senior: 5 Years of Lessons',
    excerpt: 'Technical skills matter, but mindset shifts and soft skills truly accelerate your career.',
    body: `<h2>Year 1: Imposter Syndrome is Normal</h2><p>Every developer feels like a fraud sometimes. Focus on learning, not on appearing competent.</p><h2>Year 2: Code Quality Matters</h2><p>Writing code that works is table stakes. Writing code that's readable and maintainable separates good from great developers.</p><blockquote>Any fool can write code a computer understands. Good programmers write code humans understand. — Martin Fowler</blockquote><h2>Year 3: Communication is a Superpower</h2><p>Explaining technical concepts to non-technical stakeholders is incredibly valuable. Invest in this skill early.</p><h2>Year 4: Learn System Design</h2><p>Understanding databases, caching, message queues, and APIs is what makes you a force multiplier.</p><h2>Year 5: Mentor Others</h2><p>Teaching is the best way to solidify your own knowledge. Find someone junior and help them grow.</p>`,
    category: 'Career', tags: ['career', 'growth', 'engineering'], coverImage: '',
    status: 'published', likes: 156, readTime: 6,
    createdAt: new Date(Date.now() - 86400000 * 21).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 21).toISOString()
  },
  {
    id: 'seed-5',
    title: 'Build a REST API with Node.js in 30 Minutes',
    excerpt: 'Step-by-step: create a production-ready REST API using Node.js, Express, and best practices.',
    body: `<h2>Prerequisites</h2><p>You need Node.js 18+ and basic JavaScript knowledge. That's it!</p><h2>Setting Up</h2><pre><code>mkdir my-api && cd my-api\nnpm init -y\nnpm install express cors helmet morgan</code></pre><h2>Creating the Server</h2><pre><code>const express = require('express');\nconst cors    = require('cors');\nconst helmet  = require('helmet');\n\nconst app = express();\napp.use(helmet());\napp.use(cors());\napp.use(express.json());\n\napp.get('/health', (req, res) => {\n  res.json({ status: 'ok', time: new Date() });\n});\n\napp.listen(3000, () => console.log('Server on :3000'));</code></pre><h2>Adding Routes</h2><p>Organise routes in separate files to keep the codebase clean as it grows. Use <code>express.Router()</code> for modular routing.</p>`,
    category: 'Tutorial', tags: ['nodejs', 'API', 'backend'], coverImage: '',
    status: 'published', likes: 73, readTime: 8,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// ── HELPERS ──────────────────────────────────────────────────
function calcReadTime(html) {
  const words = (html || '').replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ── LOAD / SAVE ──────────────────────────────────────────────
function loadData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  // First run — seed
  const data = { posts: SEED, likes: {} };
  saveData(data);
  return data;
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── DB OBJECT (mirrors original app.js DB) ────────────────────
const DB = {
  getAll() {
    return loadData().posts;
  },

  getPublished() {
    return DB.getAll()
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getDrafts() {
    return DB.getAll()
      .filter(p => p.status === 'draft')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getById(id) {
    return DB.getAll().find(p => p.id === id) || null;
  },

  save(post) {
    const data = loadData();
    if (!post.id) post.id = 'post-' + Date.now();
    const idx = data.posts.findIndex(p => p.id === post.id);
    const now = new Date().toISOString();

    if (idx >= 0) {
      data.posts[idx] = Object.assign({}, data.posts[idx], post, { updatedAt: now });
    } else {
      const newPost = Object.assign({
        likes: 0,
        readTime: calcReadTime(post.body || ''),
        createdAt: now,
        updatedAt: now
      }, post);
      data.posts.unshift(newPost);
    }
    saveData(data);
    return data.posts[idx >= 0 ? idx : 0];
  },

  delete(id) {
    const data = loadData();
    data.posts = data.posts.filter(p => p.id !== id);
    delete data.likes[id];
    saveData(data);
  },

  hasLiked(id, likes) {
    return !!(likes || {})[id];
  },

  toggleLike(id, clientLikes) {
    // clientLikes is the client's likes map (sent from frontend cookie/localStorage)
    // Server is the source of truth for the count
    const data = loadData();
    const post = data.posts.find(p => p.id === id);
    if (!post) return null;

    const wasLiked = !!(data.likes[id]);
    if (wasLiked) {
      delete data.likes[id];
      post.likes = Math.max(0, (post.likes || 0) - 1);
    } else {
      data.likes[id] = true;
      post.likes = (post.likes || 0) + 1;
    }
    saveData(data);
    return { liked: !wasLiked, count: post.likes };
  },

  search(query, category) {
    const q = (query || '').toLowerCase().trim();
    return DB.getPublished().filter(p => {
      const inCat = !category || category === 'All' || p.category === category;
      if (!q) return inCat;
      const haystack = [p.title, p.excerpt, p.category, ...(p.tags || [])].join(' ').toLowerCase();
      return inCat && haystack.includes(q);
    });
  },

  getStats() {
    const all   = DB.getAll();
    const pub   = all.filter(p => p.status === 'published');
    const draft = all.filter(p => p.status === 'draft');
    const likes = pub.reduce((s, p) => s + (p.likes || 0), 0);
    const words = pub.reduce((s, p) => s + (p.body || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length, 0);
    return { total: pub.length, drafts: draft.length, likes, words };
  },

  getLikes() {
    return loadData().likes || {};
  },

  AUTHOR,
  calcReadTime
};

module.exports = DB;
