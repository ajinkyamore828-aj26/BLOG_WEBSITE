import { useEffect, useRef } from 'react';

// Global toast container ref
let containerRef = null;

export function ToastContainer() {
  const ref = useRef(null);
  useEffect(() => { containerRef = ref; return () => { containerRef = null; }; }, []);
  return <div id="toast-wrap" className="toast-wrap" ref={ref} />;
}

export function showToast(msg, type = 'info') {
  if (!containerRef?.current) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  containerRef.current.appendChild(div);
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 350);
  }, 3000);
}
