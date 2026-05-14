import { useState, useEffect, useRef, useCallback } from 'react';

export default function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCurrent((idx + slides.length) % slides.length);
  }, [slides.length]);

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
  }, [slides.length]);

  const stopAuto = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto]);

  // 触摸支持
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAuto();
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    startAuto();
  };

  return (
    <div
      className="carousel-wrap"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-track-wrap">
        {slides.map((slide, i) => (
          <div key={i} className={`carousel-slide${i === current ? ' active' : ''}`}>
            <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="carousel-caption">
              <h2 className="carousel-title">{slide.title}</h2>
              <p className="carousel-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-controls">
        <button className="carousel-btn" onClick={() => goTo(current - 1)} aria-label="上一张">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`第 ${i + 1} 张`}
            />
          ))}
        </div>

        <button className="carousel-btn" onClick={() => goTo(current + 1)} aria-label="下一张">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
