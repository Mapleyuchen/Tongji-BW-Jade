import { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/ui/Carousel';
import JadeCard from '../components/ui/JadeCard';
import Lightbox from '../components/ui/Lightbox';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import { jadeCollection, carousel_slides, jadeCategories } from '../data/jadeData';

const virtues = [
  { char: '仁', title: '玉之仁', desc: '温润以泽，仁也。玉石温润的光泽如同君子的仁德之心，温和而包容。' },
  { char: '义', title: '玉之义', desc: '垂之如坠，义也。玉石沉稳厚重，象征着正直与道义。' },
  { char: '礼', title: '玉之礼', desc: '缜密以栗，礼也。玉石结构致密，代表着礼仪与秩序。' },
  { char: '智', title: '玉之智', desc: '声远而清，智也。玉石敲击声清脆悠扬，寓意智慧与通达。' },
  { char: '信', title: '玉之信', desc: '瑕不掩瑜，信也。玉石虽有瑕疵却不掩其美，象征真诚与信用。' }
];

const quotes = [
  { text: '「君子比德于玉」', source: '——《礼记》' },
  { text: '「玉不琢，不成器；人不学，不知道」', source: '——《礼记·学记》' }
];

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [lightboxJade, setLightboxJade] = useState(null);

  const filtered = filter === 'all'
    ? jadeCollection
    : jadeCollection.filter(j => j.category === filter);

  const openLightbox = (jade) => setLightboxJade(jade);
  const closeLightbox = () => setLightboxJade(null);

  const prevLightbox = () => {
    if (!lightboxJade) return;
    const idx = filtered.findIndex(j => j.id === lightboxJade.id);
    setLightboxJade(filtered[(idx - 1 + filtered.length) % filtered.length]);
  };

  const nextLightbox = () => {
    if (!lightboxJade) return;
    const idx = filtered.findIndex(j => j.id === lightboxJade.id);
    setLightboxJade(filtered[(idx + 1) % filtered.length]);
  };

  return (
    <div className="page-wrapper">
      <div className="guozi-layout">
        <LeftSidebar activeFilter={filter} onFilterChange={setFilter} />

        <main className="main-col">
          {/* ── Hero 轮播 ─────────────────────────────── */}
          <section className="section-wrap">
            <Carousel slides={carousel_slides} />
          </section>

          {/* ── 玉石鉴赏 ──────────────────────────────── */}
          <section className="section-wrap" id="gallery">
            <div className="section-head">
              <div className="title-row">
                <span className="title-ornament" />
                <h2 className="section-title">玉石鉴赏</h2>
                <span className="title-ornament" />
              </div>
              <p className="section-en">Jade Appreciation</p>
              <p className="section-desc">千年玉文化，一品玉韵长</p>
            </div>

            {/* 过滤标签 */}
            <div className="filter-bar">
              <span className="filter-label">种类</span>
              <div className="filter-tags">
                {jadeCategories.map(cat => (
                  <button
                    key={cat.key}
                    className={`filter-btn${filter === cat.key ? ' active' : ''}`}
                    onClick={() => setFilter(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="jade-grid">
              {filtered.map(jade => (
                <JadeCard key={jade.id} jade={jade} onClick={openLightbox} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/gallery" className="btn btn-outline">
                查看更多玉石 →
              </Link>
            </div>
          </section>

          {/* ── 文化典藏 ──────────────────────────────── */}
          <section className="section-wrap" id="culture">
            <div className="section-head">
              <div className="title-row">
                <span className="title-ornament" />
                <h2 className="section-title">文化典藏</h2>
                <span className="title-ornament" />
              </div>
              <p className="section-en">Cultural Heritage</p>
              <p className="section-desc">玉之五德，承载千年文明</p>
            </div>

            <div className="culture-grid">
              {virtues.map(v => (
                <div className="virtue-card" key={v.char}>
                  <div className="virtue-icon">{v.char}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>

            <div className="quotes-grid">
              {quotes.map((q, i) => (
                <blockquote className="quote-card" key={i}>
                  <p>{q.text}</p>
                  <cite>{q.source}</cite>
                </blockquote>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/culture" className="btn btn-outline">
                探索文化典藏 →
              </Link>
            </div>
          </section>

          {/* ── 关于我们 ──────────────────────────────── */}
          <section className="section-wrap" id="about">
            <div className="section-head">
              <div className="title-row">
                <span className="title-ornament" />
                <h2 className="section-title">关于我们</h2>
                <span className="title-ornament" />
              </div>
              <p className="section-en">About Us</p>
            </div>

            <div className="about-grid">
              <div className="about-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1514454709136-54a427617d1b?w=600&h=400&fit=crop"
                  alt="玉石鉴赏"
                  loading="lazy"
                />
              </div>
              <div className="about-text">
                <h3>玉韵 · 传承千年玉文化</h3>
                <p>
                  玉韵是一个致力于中国玉石文化传播与鉴赏的在线平台，集AIGC玉石创作、
                  AI智能鉴别真伪、玉石鉴赏与文化典藏于一体。
                </p>
                <p>
                  在这里，您可以欣赏到翡翠的翠绿欲滴、和田玉的温润如脂、碧玉的碧波荡漾。
                  每一件玉石都承载着大自然的鬼斧神工和工匠的精心雕琢。
                </p>
                <div className="about-features">
                  {[
                    { icon: '鉴', label: '专业鉴赏' },
                    { icon: '创', label: 'AIGC创作' },
                    { icon: '藏', label: '文化典藏' }
                  ].map(f => (
                    <div className="feat-item" key={f.icon}>
                      <span className="feat-icon">{f.icon}</span>
                      <span className="feat-label">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── AI 鉴定入口 ───────────────────────────── */}
          <section className="section-wrap">
            <div style={{
              background: 'linear-gradient(135deg, var(--jade-deep), var(--jade-dark))',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 40px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 30% 50%, rgba(184,134,11,0.15), transparent 60%)'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.25em', color: 'var(--gold-bright)', marginBottom: '12px', textTransform: 'uppercase' }}>
                  AI · 智能鉴定
                </p>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'white', marginBottom: '16px', letterSpacing: '0.15em' }}>
                  专业玉石AI鉴别
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.78)', marginBottom: '28px', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.8 }}>
                  上传玉石图片，AI 深度分析翡翠种水色、和田玉质地等级、真伪鉴别及市场估价
                </p>
                <Link to="/appraisal" className="btn btn-gold" style={{ display: 'inline-flex' }}>
                  立即开始鉴定
                </Link>
              </div>
            </div>
          </section>
        </main>

        <RightSidebar />
      </div>

      {lightboxJade && (
        <Lightbox
          jade={lightboxJade}
          items={filtered}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </div>
  );
}
