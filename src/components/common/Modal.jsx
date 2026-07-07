import React, { useEffect } from 'react';

export default function Modal({ title, subtitle, onClose, children, width = 880, showSidebar = false }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-panel ${showSidebar ? 'modal-panel--with-sidebar' : ''}`} style={{ maxWidth: width }}>
        <div className="modal-header">
          <div>
            {showSidebar && (
              <button className="icon-btn modal-back-btn" onClick={onClose} aria-label="Back">
                ←
              </button>
            )}
            <h2>{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={`modal-body ${showSidebar ? 'modal-body--with-sidebar' : ''}`}>
          {showSidebar && (
            <div className="modal-sidebar">
              <div className="sidebar-step sidebar-step--active">
                <div className="step-indicator">
                  <div className="step-circle"></div>
                </div>
                <span className="step-label">Practice Information</span>
              </div>
            </div>
          )}
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
