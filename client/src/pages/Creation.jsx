import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../components/ui/Notification';

const shapes = [
  { key: 'circle',    label: '圆形',   icon: '○' },
  { key: 'oval',      label: '椭圆',   icon: '⬭' },
  { key: 'rectangle', label: '长方',   icon: '▭' },
  { key: 'drop',      label: '水滴',   icon: '💧' },
  { key: 'leaf',      label: '树叶',   icon: '🍃' },
  { key: 'bamboo',    label: '竹节',   icon: '🎍' }
];

const materials = [
  { key: 'feicui',  label: '翡翠',   color: '#2E8B57', swatch: 'linear-gradient(135deg,#3CB371,#006400)' },
  { key: 'hetian',  label: '和田玉', color: '#F5F0E8', swatch: 'linear-gradient(135deg,#FFFAF0,#DDD0B8)' },
  { key: 'biyu',    label: '碧玉',   color: '#2F6B4A', swatch: 'linear-gradient(135deg,#3D8B5A,#1B4B30)' },
  { key: 'ziyu',    label: '紫玉',   color: '#7B5EA7', swatch: 'linear-gradient(135deg,#9B6EC7,#5A3080)' },
  { key: 'huangyu', label: '黄玉',   color: '#D4A520', swatch: 'linear-gradient(135deg,#F0C040,#A07010)' },
  { key: 'heshi',   label: '墨石',   color: '#2C2C2C', swatch: 'linear-gradient(135deg,#4A4A4A,#111111)' }
];

const patterns = [
  { key: 'none',   label: '无图案', icon: '—' },
  { key: 'guashi', label: '八卦',   icon: '☰' },
  { key: 'lianhua',label: '莲花',   icon: '莲' },
  { key: 'ruyi',   label: '如意',   icon: '如意' },
  { key: 'shou',   label: '寿字',   icon: '寿' },
  { key: 'fu',     label: '福字',   icon: '福' },
  { key: 'lu',     label: '禄字',   icon: '禄' },
  { key: 'bi',     label: '玉璧',   icon: '璧' }
];

const ringSizes = [10,11,12,13,14,15,16,17,18,19,20,21];

const inspirations = [
  { img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&h=300&fit=crop', desc: '翠绿观音' },
  { img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=300&h=300&fit=crop', desc: '白玉平安扣' },
  { img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop', desc: '帝王绿戒面' },
  { img: 'https://images.unsplash.com/photo-1598618356794-eb1720430eb4?w=300&h=300&fit=crop', desc: '碧玉手镯' },
  { img: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=300&h=300&fit=crop', desc: '紫罗兰手串' },
  { img: 'https://images.unsplash.com/photo-1514454709136-54a427617d1b?w=300&h=300&fit=crop', desc: '福禄寿摆件' }
];

function lightenColor(hex, amount) {
  const n = parseInt(hex.replace('#',''), 16);
  const a = Math.round(2.55 * amount);
  const r = Math.min(255,(n >> 16) + a);
  const g = Math.min(255,((n >> 8) & 0xFF) + a);
  const b = Math.min(255,(n & 0xFF) + a);
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
}

function darkenColor(hex, amount) {
  const n = parseInt(hex.replace('#',''), 16);
  const a = Math.round(2.55 * amount);
  const r = Math.max(0,(n >> 16) - a);
  const g = Math.max(0,((n >> 8) & 0xFF) - a);
  const b = Math.max(0,(n & 0xFF) - a);
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
}

export default function Creation() {
  const notify = useNotification();
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [state, setState] = useState({
    shape: 'circle', material: 'feicui', color: '#2E8B57',
    pattern: 'none', width: 100, height: 100, ringSize: 14
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setState(prev => ({ ...prev, [key]: val }));

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const scale = Math.min(W / state.width, H / state.height) * 0.55;
    const cx = W / 2, cy = H / 2;
    const w = state.width * scale, h = state.height * scale;

    const grad = ctx.createLinearGradient(cx - w/2, cy - h/2, cx + w/2, cy + h/2);
    grad.addColorStop(0, lightenColor(state.color, 35));
    grad.addColorStop(0.5, state.color);
    grad.addColorStop(1, darkenColor(state.color, 25));

    ctx.beginPath();
    switch (state.shape) {
      case 'circle':    ctx.arc(cx, cy, Math.min(w,h)/2, 0, Math.PI*2); break;
      case 'oval':      ctx.ellipse(cx, cy, w/2, h/2, 0, 0, Math.PI*2); break;
      case 'rectangle':
        ctx.roundRect(cx-w/2, cy-h/2, w, h, 16);
        break;
      case 'drop':
        ctx.moveTo(cx, cy-h/2);
        ctx.bezierCurveTo(cx+w/2, cy-h/4, cx+w/2, cy+h/4, cx, cy+h/2);
        ctx.bezierCurveTo(cx-w/2, cy+h/4, cx-w/2, cy-h/4, cx, cy-h/2);
        break;
      case 'leaf':
        ctx.moveTo(cx, cy-h/2);
        ctx.bezierCurveTo(cx+w, cy-h/4, cx+w, cy+h/4, cx, cy+h/2);
        ctx.bezierCurveTo(cx-w, cy+h/4, cx-w, cy-h/4, cx, cy-h/2);
        break;
      case 'bamboo': {
        const segs = 3, sh = h/segs;
        for(let i=0;i<segs;i++){
          const sy = cy-h/2+i*sh;
          ctx.moveTo(cx-w/3, sy);
          ctx.lineTo(cx-w/3, sy+sh);
          ctx.lineTo(cx+w/3, sy+sh);
          ctx.lineTo(cx+w/3, sy);
          ctx.closePath();
        }
        break;
      }
      default: ctx.arc(cx, cy, Math.min(w,h)/2, 0, Math.PI*2);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 高光
    const hGrad = ctx.createRadialGradient(cx-w/4, cy-h/4, 0, cx, cy, Math.max(w,h)/2);
    hGrad.addColorStop(0, 'rgba(255,255,255,0.45)');
    hGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    hGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hGrad;
    ctx.fill();

    // 描边
    ctx.strokeStyle = darkenColor(state.color, 30);
    ctx.lineWidth = 3;
    ctx.stroke();

    // 图案
    if (state.pattern && state.pattern !== 'none') {
      const patternMap = { guashi:'☰', lianhua:'莲', ruyi:'如意', shou:'寿', fu:'福', lu:'禄', bi:'璧' };
      const text = patternMap[state.pattern];
      if (text) {
        const fontSize = Math.min(state.width, state.height) * scale * 0.35;
        ctx.font = `bold ${fontSize}px "Noto Serif SC", serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cx, cy);
      }
    }
  };

  useEffect(() => { draw(); }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) { canvas.width = 400; canvas.height = 400; draw(); }
  }, []);

  const reset = () => {
    setState({ shape:'circle', material:'feicui', color:'#2E8B57', pattern:'none', width:100, height:100, ringSize:14 });
    notify('已重置设计');
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `jade-design-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    notify('设计已保存为图片');
  };

  const uploadSketch = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width/img.width, canvas.height/img.height);
        const x = (canvas.width - img.width*scale)/2;
        const y = (canvas.height - img.height*scale)/2;
        ctx.drawImage(img, x, y, img.width*scale, img.height*scale);
        notify('草图已上传到画布');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    notify('设计方案已提交！我们会尽快与您联系。');
    setTimeout(() => { setSubmitted(false); e.target.reset(); }, 2000);
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <h2 className="page-hero-title">玉石创作</h2>
          <p className="page-hero-en">Jade Design Studio</p>
          <p className="page-hero-desc">以意为笔，以玉为纸，创作属于你的玉石艺术</p>
        </div>
      </div>

      <div className="standard-layout">
        <div className="creation-layout">
          {/* ── 左侧控制面板 ──────────────────────── */}
          <aside className="control-panel">
            {/* 形状 */}
            <div className="panel-section">
              <h3 className="panel-title">选择形状</h3>
              <div className="options-grid">
                {shapes.map(s => (
                  <button
                    key={s.key}
                    className={`opt-btn${state.shape === s.key ? ' active' : ''}`}
                    onClick={() => set('shape', s.key)}
                  >
                    <span className="opt-icon">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 材质 */}
            <div className="panel-section">
              <h3 className="panel-title">选择材质</h3>
              <div className="material-grid">
                {materials.map(m => (
                  <button
                    key={m.key}
                    className={`mat-btn${state.material === m.key ? ' active' : ''}`}
                    onClick={() => { set('material', m.key); set('color', m.color); }}
                  >
                    <span
                      className="mat-swatch"
                      style={{ background: m.swatch }}
                    />
                    <span style={{ fontSize: '0.72rem' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 图案 */}
            <div className="panel-section">
              <h3 className="panel-title">雕刻图案</h3>
              <div className="options-grid">
                {patterns.map(p => (
                  <button
                    key={p.key}
                    className={`opt-btn${state.pattern === p.key ? ' active' : ''}`}
                    onClick={() => set('pattern', p.key)}
                  >
                    <span className="opt-icon" style={{ fontSize: p.key === 'none' ? '1.2rem' : '1.3rem' }}>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 尺寸 */}
            <div className="panel-section">
              <h3 className="panel-title">调整尺寸</h3>
              <div className="slider-group">
                <div className="slider-row">
                  <div className="slider-label">
                    <span>宽度</span>
                    <span className="slider-val">{state.width} mm</span>
                  </div>
                  <input type="range" min="30" max="200" value={state.width}
                    onChange={e => set('width', parseInt(e.target.value))} />
                </div>
                <div className="slider-row">
                  <div className="slider-label">
                    <span>高度</span>
                    <span className="slider-val">{state.height} mm</span>
                  </div>
                  <input type="range" min="30" max="200" value={state.height}
                    onChange={e => set('height', parseInt(e.target.value))} />
                </div>
              </div>
            </div>

            {/* 戒指尺寸 */}
            <div className="panel-section">
              <h3 className="panel-title">戒指尺寸</h3>
              <div className="ring-grid">
                {ringSizes.map(sz => (
                  <button
                    key={sz}
                    className={`ring-btn${state.ringSize === sz ? ' active' : ''}`}
                    onClick={() => set('ringSize', sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── 右侧画布区 ────────────────────────── */}
          <div className="canvas-area">
            <div className="canvas-wrap">
              <h3 className="canvas-title">✦ 玉石设计预览 ✦</h3>
              <div className="canvas-bg">
                <canvas ref={canvasRef} id="creationCanvas" />
              </div>
              <div className="canvas-actions">
                <button className="btn btn-ghost" onClick={reset}>重置</button>
                <button className="btn btn-outline" onClick={uploadSketch}>上传草图</button>
                <button className="btn btn-primary" onClick={save}>保存图片</button>
                <button className="btn btn-gold">提交定制</button>
              </div>
            </div>

            {/* 灵感画廊 */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--jade-dark)', marginBottom: '16px', letterSpacing: '0.08em' }}>
                ✦ 灵感画廊
              </h3>
              <div className="inspiration-grid">
                {inspirations.map((item, i) => (
                  <div className="inspiration-card" key={i}>
                    <img src={item.img} alt={item.desc} loading="lazy" />
                    <div className="insp-overlay">
                      <span className="insp-text">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 提交表单 */}
            <div className="submit-form-wrap">
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--jade-dark)', marginBottom: '6px', letterSpacing: '0.08em' }}>
                  提交定制方案
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  填写信息后提交，我们的工匠将与您沟通具体设计细节。
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label">设计方案名称 *</label>
                    <input className="form-input" name="designName" placeholder="请输入您的设计方案名称" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">您的姓名 *</label>
                    <input className="form-input" name="userName" placeholder="请输入您的姓名" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">联系电话 *</label>
                    <input className="form-input" name="userPhone" type="tel" placeholder="请输入联系电话" required />
                  </div>
                  <div className="form-field">
                    <label className="form-label">电子邮箱</label>
                    <input className="form-input" name="userEmail" type="email" placeholder="请输入电子邮箱" />
                  </div>
                  <div className="form-field full">
                    <label className="form-label">设计备注</label>
                    <textarea className="form-textarea" name="designNote" placeholder="请描述您的设计想法、特殊要求等..." />
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="btn btn-gold"
                    disabled={submitted}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {submitted ? '提交中...' : '✦ 提交定制方案'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}
