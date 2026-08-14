import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer, showToast } from '../components/Toast';
import api from '../lib/api';
import { genId } from '../lib/utils';

export default function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  // ── STATE ──────────────────────────────────────────────
  const [postId,     setPostId]     = useState(genId());
  const [postStatus, setPostStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState('');
  const [tags,       setTags]       = useState([]);
  const [tagInput,   setTagInput]   = useState('');
  const [wordCount,  setWordCount]  = useState(0);
  const [readMins,   setReadMins]   = useState(1);
  const [autosaved,  setAutosaved]  = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [preview,    setPreview]    = useState({ title: '', meta: '', body: '', cover: '' });
  const [showLinkDlg, setShowLinkDlg] = useState(false);
  const [showImgDlg,  setShowImgDlg]  = useState(false);
  const [linkText,   setLinkText]   = useState('');
  const [linkUrl,    setLinkUrl]    = useState('');
  const [imgUrl,     setImgUrl]     = useState('');
  const [imgAlt,     setImgAlt]     = useState('');

  // Checklist
  const [chkTitle,   setChkTitle]   = useState(false);
  const [chkContent, setChkContent] = useState(false);
  const [chkCat,     setChkCat]     = useState(false);

  const editorRef    = useRef(null);
  const titleRef     = useRef(null);
  const excerptRef   = useRef(null);
  const catRef       = useRef(null);
  const asTimer      = useRef(null);
  const savedRange   = useRef(null);

  // ── LOAD EXISTING POST ────────────────────────────────
  useEffect(() => {
    (async () => {
      if (editId) {
        const p = await api.getById(editId);
        if (p) applyData(p);
        else showToast('Post not found', 'error');
      } else {
        const saved = api.loadAutosave();
        if (saved && saved.title && confirm(`Found an unsaved draft: "${saved.title}". Restore it?`)) {
          applyData(saved);
        } else {
          api.clearAutosave();
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyData(p) {
    if (p.id) setPostId(p.id);
    if (p.title    && titleRef.current)   { titleRef.current.value   = p.title;   resizeTA(titleRef.current); }
    if (p.excerpt  && excerptRef.current) { excerptRef.current.value = p.excerpt; resizeTA(excerptRef.current); }
    if (p.body     && editorRef.current)  editorRef.current.innerHTML = p.body;
    if (p.category && catRef.current)     catRef.current.value = p.category;
    if (p.status)  setPostStatus(p.status);
    if (p.tags)    setTags([...p.tags]);
    if (p.coverImage) { setCoverImage(p.coverImage); }
    updateWC();
    updateChecklist();
  }

  // ── TEXTAREA AUTO-RESIZE ──────────────────────────────
  function resizeTA(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  // ── WORD COUNT ────────────────────────────────────────
  const updateWC = useCallback(() => {
    const txt = editorRef.current?.innerText || '';
    const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    const mins  = Math.max(1, Math.round(words / 200));
    setWordCount(words);
    setReadMins(mins);
  }, []);

  // ── CHECKLIST ─────────────────────────────────────────
  const updateChecklist = useCallback(() => {
    setChkTitle  (!!(titleRef.current?.value.trim().length >= 3));
    setChkContent(!!(editorRef.current?.innerText?.trim().length >= 10));
    setChkCat    (!!(catRef.current?.value));
  }, []);

  // ── AUTOSAVE ──────────────────────────────────────────
  const triggerAutosave = useCallback(() => {
    clearTimeout(asTimer.current);
    asTimer.current = setTimeout(() => {
      api.autosave(collect());
      setAutosaved(true);
      setTimeout(() => setAutosaved(false), 2000);
    }, 1500);
  }, []);

  function onInput() { updateWC(); updateChecklist(); triggerAutosave(); }

  // ── COLLECT ───────────────────────────────────────────
  function collect() {
    return {
      id:         postId,
      title:      titleRef.current?.value.trim()     || '',
      excerpt:    excerptRef.current?.value.trim()   || '',
      body:       editorRef.current?.innerHTML       || '',
      category:   catRef.current?.value              || '',
      tags:       [...tags],
      coverImage,
      status:     postStatus
    };
  }

  // ── SAVE DRAFT ────────────────────────────────────────
  async function doSaveDraft() {
    const data = { ...collect(), status: 'draft' };
    await api.save(data);
    api.clearAutosave();
    showToast('Draft saved!', 'success');
    if (!searchParams.get('id')) {
      navigate(`/editor?id=${postId}`, { replace: true });
    }
  }

  // ── PUBLISH ───────────────────────────────────────────
  async function doPublish() {
    const title   = titleRef.current?.value.trim()           || '';
    const content = editorRef.current?.innerText?.trim()     || '';
    const cat     = catRef.current?.value                    || '';
    if (!title)          { showToast('⚠️ Please add a title!',          'error'); titleRef.current?.focus();   return; }
    if (content.length < 10) { showToast('⚠️ Please write some content!', 'error'); editorRef.current?.focus(); return; }
    if (!cat)            { showToast('⚠️ Please select a category!',    'error'); catRef.current?.focus();    return; }

    const data = { ...collect(), status: 'published' };
    const saved = await api.save(data);
    api.clearAutosave();
    const pid = saved.id || postId;
    showToast('🎉 Published successfully!', 'success');
    setTimeout(() => navigate(`/post/${pid}`), 1000);
  }

  // ── PREVIEW ───────────────────────────────────────────
  function doPreview() {
    const data = collect();
    setPreview({
      title: data.title || 'Untitled',
      meta:  `📂 ${data.category || 'None'} · ${api.calcReadTime(data.body)} min read${data.tags.length ? ' · ' + data.tags.map(t => '#' + t).join(' ') : ''}`,
      body:  data.body,
      cover: data.coverImage
    });
    setShowPreview(true);
  }

  // ── TOOLBAR ───────────────────────────────────────────
  function cmd(c, v) { editorRef.current?.focus(); document.execCommand(c, false, v || null); }
  function fmtBlock(tag) { if (!tag) return; editorRef.current?.focus(); document.execCommand('formatBlock', false, tag); }
  function wrapInCode() {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const rng  = sel.getRangeAt(0);
    const code = document.createElement('code');
    try { code.appendChild(rng.extractContents()); rng.insertNode(code); }
    catch (e) { document.execCommand('insertHTML', false, '<code>code</code>'); }
  }

  // ── LINK DIALOG ───────────────────────────────────────
  function openLinkDlg() {
    try { savedRange.current = window.getSelection()?.getRangeAt(0); } catch (e) {}
    const sel = savedRange.current?.toString() || '';
    setLinkText(sel);
    setLinkUrl('');
    setShowLinkDlg(true);
    setTimeout(() => document.getElementById('link-url-in')?.focus(), 80);
  }
  function insertLink() {
    const txt = linkText || 'link';
    if (!linkUrl.trim()) { showToast('Please enter a URL', 'error'); return; }
    editorRef.current?.focus();
    if (savedRange.current) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange.current); }
    document.execCommand('insertHTML', false, `<a href="${linkUrl}" target="_blank">${txt}</a>`);
    setShowLinkDlg(false);
  }

  // ── IMAGE DIALOG ──────────────────────────────────────
  function openImgDlg() {
    try { savedRange.current = window.getSelection()?.getRangeAt(0); } catch (e) {}
    setImgUrl(''); setImgAlt('');
    setShowImgDlg(true);
    setTimeout(() => document.getElementById('img-url-in')?.focus(), 80);
  }
  function insertImg() {
    const url = imgUrl.trim();
    const alt = imgAlt.trim() || 'Image';
    if (!url) { showToast('Please enter an image URL', 'error'); return; }
    editorRef.current?.focus();
    if (savedRange.current) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange.current); }
    document.execCommand('insertHTML', false, `<img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;">`);
    setShowImgDlg(false);
  }

  // ── TAGS ──────────────────────────────────────────────
  function handleTag(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = e.target.value.trim().replace(/^#/, '').replace(/\s+/g, '-').toLowerCase();
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags(prev => [...prev, val]);
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !e.target.value && tags.length) {
      setTags(prev => prev.slice(0, -1));
    }
  }

  // ── COVER ─────────────────────────────────────────────
  function handleCoverFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setCoverImage(ev.target.result);
    r.readAsDataURL(file);
  }
  function handleCoverUrl(url) { if (url && url.startsWith('http')) setCoverImage(url); }
  function removeCover() { setCoverImage(''); }

  // ── KEYBOARD SHORTCUTS ────────────────────────────────
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); doSaveDraft(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, postStatus, coverImage, postId]);

  // Tab in editor
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const handler = e => {
      if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;'); }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <Navbar
        actions={
          <>
            <div className={`autosave-bar ${autosaved ? 'show' : ''}`}>
              <span className="autosave-dot" /> Saved
            </div>
            <button className="btn btn-ghost btn-sm"     onClick={doPreview}>👁 Preview</button>
            <button className="btn btn-secondary btn-sm" onClick={doSaveDraft}>💾 Save Draft</button>
            <button className="btn btn-primary"          onClick={doPublish}>🚀 Publish</button>
          </>
        }
      />
      <ToastContainer />

      {/* Title area */}
      <div className="editor-top" style={{ marginTop: '66px' }}>
        <textarea
          id="post-title"
          ref={titleRef}
          className="editor-main-title"
          placeholder="Your Post Title…"
          rows={1}
          onInput={e => { resizeTA(e.target); updateChecklist(); triggerAutosave(); }}
        />
        <textarea
          id="post-excerpt"
          ref={excerptRef}
          className="editor-excerpt"
          placeholder="Short excerpt / summary (optional)…"
          rows={2}
          onInput={e => { resizeTA(e.target); triggerAutosave(); }}
        />
      </div>

      {/* Toolbar */}
      <div className="toolbar-bar" id="toolbar-bar">
        <select className="tb-select" onChange={e => { fmtBlock(e.target.value); e.target.selectedIndex = 0; }}>
          <option value="">¶ Paragraph</option>
          <option value="h1">H1 Heading</option>
          <option value="h2">H2 Heading</option>
          <option value="h3">H3 Heading</option>
          <option value="blockquote">❝ Quote</option>
          <option value="pre">⌨ Code Block</option>
        </select>
        <div className="tb-divider" />
        <button className="tb-btn" title="Bold (Ctrl+B)"      onClick={() => cmd('bold')}><b>B</b></button>
        <button className="tb-btn" title="Italic (Ctrl+I)"    onClick={() => cmd('italic')}><i>I</i></button>
        <button className="tb-btn" title="Underline (Ctrl+U)" onClick={() => cmd('underline')}><u>U</u></button>
        <button className="tb-btn" title="Strikethrough"      onClick={() => cmd('strikeThrough')}><s>S</s></button>
        <div className="tb-divider" />
        <button className="tb-btn" title="Bullet list"  onClick={() => cmd('insertUnorderedList')}>≡</button>
        <button className="tb-btn" title="Number list"  onClick={() => cmd('insertOrderedList')}>1.</button>
        <div className="tb-divider" />
        <button className="tb-btn" title="Insert link"  onClick={openLinkDlg}>🔗</button>
        <button className="tb-btn" title="Insert image" onClick={openImgDlg}>🖼</button>
        <button className="tb-btn" title="Inline code"  onClick={wrapInCode}>&#96;</button>
        <div className="tb-divider" />
        <button className="tb-btn" title="Undo" onClick={() => cmd('undo')}>↩</button>
        <button className="tb-btn" title="Redo" onClick={() => cmd('redo')}>↪</button>
      </div>

      {/* Editor layout */}
      <div className="editor-layout">
        {/* Main editor */}
        <div className="editor-main">
          <div
            id="editor"
            ref={editorRef}
            className="editor-content"
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Start writing your story here…"
            onInput={onInput}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.4rem 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span id="wc-label">{wordCount.toLocaleString()} words · ~{readMins} min read</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Status */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Status</div>
            <div className="status-row">
              <button className={`status-btn ${postStatus === 'draft'     ? 'active' : ''}`} id="btn-draft"     onClick={() => setPostStatus('draft')}>Draft</button>
              <button className={`status-btn ${postStatus === 'published' ? 'active' : ''}`} id="btn-published" onClick={() => setPostStatus('published')}>Published</button>
            </div>
          </div>

          {/* Checklist */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">✅ Publish Checklist</div>
            <div className="checklist">
              <div className={`check-row ${chkTitle   ? 'ok' : ''}`}><span>{chkTitle   ? '✅' : '⚪'}</span> Title added</div>
              <div className={`check-row ${chkContent ? 'ok' : ''}`}><span>{chkContent ? '✅' : '⚪'}</span> Content written</div>
              <div className={`check-row ${chkCat     ? 'ok' : ''}`}><span>{chkCat     ? '✅' : '⚪'}</span> Category selected</div>
            </div>
          </div>

          {/* Settings */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">⚙️ Settings</div>
            <div className="form-group">
              <label className="form-label" htmlFor="post-cat">Category *</label>
              <select id="post-cat" ref={catRef} className="form-select" onChange={updateChecklist}>
                <option value="">Select a category…</option>
                <option>Technology</option>
                <option>Programming</option>
                <option>Design</option>
                <option>Career</option>
                <option>Tutorial</option>
                <option>Opinion</option>
                <option>Lifestyle</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags <small style={{ color: 'var(--text-muted)' }}>(press Enter)</small></label>
              <div className="tags-wrap" id="tags-wrap" onClick={() => document.getElementById('tag-input')?.focus()}>
                {tags.map((tag, i) => (
                  <span key={i} className="tag-pill">
                    #{tag}<span className="tag-x" onClick={() => setTags(prev => prev.filter((_, j) => j !== i))}>×</span>
                  </span>
                ))}
                <input
                  type="text"
                  id="tag-input"
                  className="tags-input"
                  placeholder="Add tag…"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTag}
                />
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">🖼 Cover Image</div>
            {coverImage ? (
              <div id="cover-preview">
                <img id="cover-img" className="cover-preview-img" src={coverImage} alt="Cover" />
                <button onClick={removeCover} style={{ fontSize: '0.75rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}>Remove</button>
              </div>
            ) : (
              <div id="cover-drop" className="cover-drop">
                <input type="file" id="cover-file" accept="image/*" onChange={handleCoverFile} />
                <div className="cover-drop-icon">📷</div>
                <div className="cover-drop-text">Click to upload cover image</div>
              </div>
            )}
            <div style={{ marginTop: '0.65rem' }}>
              <label className="form-label">Or image URL</label>
              <input type="url" id="cover-url-input" className="form-input" placeholder="https://…" onInput={e => handleCoverUrl(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Overlay */}
      {showPreview && (
        <div id="preview-overlay" style={{ display: 'block' }}>
          <div className="preview-inner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Preview</h2>
              <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>✕ Close</button>
            </div>
            <h1 id="pv-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>{preview.title}</h1>
            <div id="pv-meta" style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>{preview.meta}</div>
            {preview.cover && <img id="pv-cover" style={{ width: '100%', borderRadius: 'var(--r-md)', marginBottom: '1.5rem', maxHeight: '380px', objectFit: 'cover' }} src={preview.cover} alt="" />}
            <div id="pv-body" className="post-body" dangerouslySetInnerHTML={{ __html: preview.body }} />
          </div>
        </div>
      )}

      {/* Link Dialog */}
      <div className={`modal-bg ${showLinkDlg ? 'open' : ''}`} id="link-dlg" onClick={e => { if (e.target === e.currentTarget) setShowLinkDlg(false); }}>
        <div className="modal-box">
          <h3 className="modal-title">Insert Link</h3>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Link Text</label>
            <input type="text" id="link-text-in" className="form-input" placeholder="Display text" value={linkText} onChange={e => setLinkText(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">URL</label>
            <input type="url" id="link-url-in" className="form-input" placeholder="https://…" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
          </div>
          <div className="modal-foot" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowLinkDlg(false)}>Cancel</button>
            <button className="btn btn-primary"   onClick={insertLink}>Insert</button>
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <div className={`modal-bg ${showImgDlg ? 'open' : ''}`} id="img-dlg" onClick={e => { if (e.target === e.currentTarget) setShowImgDlg(false); }}>
        <div className="modal-box">
          <h3 className="modal-title">Insert Image</h3>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Image URL</label>
            <input type="url" id="img-url-in" className="form-input" placeholder="https://…" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Alt Text</label>
            <input type="text" id="img-alt-in" className="form-input" placeholder="Image description" value={imgAlt} onChange={e => setImgAlt(e.target.value)} />
          </div>
          <div className="modal-foot" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowImgDlg(false)}>Cancel</button>
            <button className="btn btn-primary"   onClick={insertImg}>Insert</button>
          </div>
        </div>
      </div>
    </>
  );
}
