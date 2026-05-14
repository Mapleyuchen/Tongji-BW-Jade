import { useEffect } from 'react';

export default function Lightbox({ jade, items, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!jade) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [jade, onClose, onPrev, onNext]);

  if (!jade) return null;

  return (
    <div className="lightbox open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lightbox-close" onClick={onClose} aria-label="关闭">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="lightbox-inner">
        <img src={jade.image} alt={jade.name} className="lightbox-img" />
        <div className="lightbox-caption">
          <h3>{jade.name}</h3>
          <p>{jade.description}</p>
          {jade.price && (
            <p style={{ marginTop: '8px', color: 'var(--gold-bright)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              {jade.price}
            </p>
          )}
        </div>
      </div>

      <button className="lightbox-nav prev" onClick={onPrev} aria-label="上一张">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button className="lightbox-nav next" onClick={onNext} aria-label="下一张">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
