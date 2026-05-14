import { useState, useMemo } from 'react';
import JadeCard from '../components/ui/JadeCard';
import Lightbox from '../components/ui/Lightbox';
import { jadeCollection, jadeCategories, colorFilters } from '../data/jadeData';

export default function Gallery() {
  const [catFilter, setCatFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [lightboxJade, setLightboxJade] = useState(null);

  const filtered = useMemo(() => {
    return jadeCollection.filter(jade => {
      const catMatch = catFilter === 'all' || jade.category === catFilter;
      const colorMatch = colorFilter === 'all' || jade.color === colorFilter;
      return catMatch && colorMatch;
    });
  }, [catFilter, colorFilter]);

  const openLightbox = (jade) => setLightboxJade(jade);
  const closeLightbox = () => setLightboxJade(null);

  const prev = () => {
    if (!lightboxJade) return;
    const idx = filtered.findIndex(j => j.id === lightboxJade.id);
    setLightboxJade(filtered[(idx - 1 + filtered.length) % filtered.length]);
  };

  const next = () => {
    if (!lightboxJade) return;
    const idx = filtered.findIndex(j => j.id === lightboxJade.id);
    setLightboxJade(filtered[(idx + 1) % filtered.length]);
  };

  return (
    <div className="page-wrapper">
      {/* 页面英雄 */}
      <div className="page-hero">
        <div
          className="page-hero-ornament left"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 200'%3E%3Cpath d='M45,0 L45,200' stroke='%23B8860B' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='45' cy='40' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='45' cy='100' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='45' cy='160' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        />
        <div className="page-hero-content">
          <h2 className="page-hero-title">玉石鉴赏</h2>
          <p className="page-hero-en">Jade Appreciation Gallery</p>
          <p className="page-hero-desc">品鉴天下美玉，传承千年文化</p>
        </div>
        <div
          className="page-hero-ornament right"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 200'%3E%3Cpath d='M45,0 L45,200' stroke='%23B8860B' stroke-width='1' opacity='0.4'/%3E%3Ccircle cx='45' cy='40' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='45' cy='100' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3Ccircle cx='45' cy='160' r='8' fill='none' stroke='%23B8860B' stroke-width='1.5' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
          }}
        />
      </div>

      <div className="gallery-page-layout">
        {/* 筛选区 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <div className="filter-bar">
            <span className="filter-label">玉石种类</span>
            <div className="filter-tags">
              {jadeCategories.map(cat => (
                <button
                  key={cat.key}
                  className={`filter-btn${catFilter === cat.key ? ' active' : ''}`}
                  onClick={() => setCatFilter(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-bar">
            <span className="filter-label">颜色</span>
            <div className="filter-tags">
              {colorFilters.map(cf => (
                <button
                  key={cf.key}
                  className={`filter-btn${colorFilter === cf.key ? ' active' : ''}`}
                  onClick={() => setColorFilter(cf.key)}
                >
                  {cf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          共找到 <strong style={{ color: 'var(--jade-dark)' }}>{filtered.length}</strong> 件玉石藏品
        </p>

        {/* 玉石网格 */}
        {filtered.length > 0 ? (
          <div className="jade-grid">
            {filtered.map(jade => (
              <JadeCard key={jade.id} jade={jade} onClick={openLightbox} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>玉</div>
            <p>暂无符合条件的玉石，请尝试其他筛选条件</p>
          </div>
        )}
      </div>

      {lightboxJade && (
        <Lightbox
          jade={lightboxJade}
          items={filtered}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
