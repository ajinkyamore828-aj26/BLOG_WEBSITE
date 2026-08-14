import { useEffect } from 'react';

export default function ConfirmModal({ isOpen, title, body, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, onConfirm, onCancel }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = e => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  return (
    <div
      id="g-modal"
      className={`modal-bg ${isOpen ? 'open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onCancel?.(); }}
    >
      <div className="modal-box">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-body-text">{body}</p>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
