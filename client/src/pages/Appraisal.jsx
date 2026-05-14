import { useState, useRef } from 'react';
import { useNotification } from '../components/ui/Notification';

const steps = [
  { num: '01', title: '上传图片', desc: '上传 1-6 张清晰的玉石图片，多角度拍摄效果更佳' },
  { num: '02', title: 'AI 深度分析', desc: '系统调用专业视觉AI模型，综合分析玉石特征' },
  { num: '03', title: '获取报告', desc: '获得包含种水色、真伪鉴别、估价等的完整鉴定报告' }
];

function generateMockResult() {
  const types = ['翡翠', '和田玉', '碧玉', '独山玉'];
  const origins = ['缅甸', '新疆和田', '俄罗斯', '河南南阳', '加拿大'];
  const colors = ['帝王绿', '玻璃种', '阳绿', '苹果绿', '菠菜绿', '羊脂白'];
  const isNatural = Math.random() > 0.15;
  const score = 68 + Math.floor(Math.random() * 28);
  const grade = score >= 90 ? '优质' : score >= 78 ? '良好' : '一般';
  const price = Math.floor(Math.random() * 180 + 12) * 10000;

  return {
    score, grade,
    type: types[Math.floor(Math.random() * types.length)],
    origin: origins[Math.floor(Math.random() * origins.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    transparency: ['透明', '半透明', '微透明', '不透明'][Math.floor(Math.random() * 4)],
    texture: ['极细腻', '细腻', '中等', '粗糙'][Math.floor(Math.random() * 4)],
    craft: ['精细', '良好', '一般', '简单'][Math.floor(Math.random() * 4)],
    isNatural,
    authenticity: isNatural ? '天然玉石 A货' : '处理玉石 B/C货',
    price,
    advice: isNatural
      ? '该玉石品质优良，天然无处理，颜色种水均属上乘，具有较好的收藏投资价值。建议在信誉可靠的渠道购入，并索要权威机构（GIA/NGTC）出具的鉴定证书。'
      : '该玉石疑似经过化学充填或染色处理，价值相对有限。购买时请务必向商家索要正规鉴定机构的鉴定证书，货比三家，谨慎决策。',
    careTips: [
      '避免与硬物碰撞，存放时单独放置或包裹软布',
      '定期用温热清水冲洗，软毛刷轻刷缝隙，软布擦干',
      '避免长时间暴晒，防止褪色与干裂',
      '远离化学品，如香水、沐浴液、漂白剂等',
      '定期"养玉"，佩戴或盘把可使玉石更加温润光泽'
    ]
  };
}

export default function Appraisal() {
  const notify = useNotification();
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDrag, setIsDrag] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [animScore, setAnimScore] = useState(0);
  const [useRealAI, setUseRealAI] = useState(false);

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f => {
      if (!f.type.startsWith('image/')) { notify('请上传图片文件', 'error'); return false; }
      if (f.size > 10 * 1024 * 1024) { notify('图片大小不能超过10MB', 'error'); return false; }
      return true;
    });

    if (files.length + valid.length > 6) {
      notify('最多上传6张图片', 'error');
      return;
    }

    const readers = valid.map(file =>
      new Promise(res => {
        const r = new FileReader();
        r.onload = e => res({ file, url: e.target.result });
        r.readAsDataURL(file);
      })
    );

    Promise.all(readers).then(items => setFiles(prev => [...prev, ...items]));
  };

  const remove = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    addFiles(e.dataTransfer.files);
  };

  const handleIdentify = async () => {
    if (processing || files.length === 0) return;
    setProcessing(true);
    setResult(null);
    setAnimScore(0);

    const steps = [800, 1200, 1000, 900, 1100, 700];

    if (useRealAI) {
      // 真实 API 鉴定
      try {
        const formData = new FormData();
        files.forEach(item => formData.append('images', item.file));

        let elapsed = 0;
        for (const delay of steps) {
          await new Promise(r => setTimeout(r, delay));
          elapsed += delay;
        }

        const res = await fetch('/api/jade/identify', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (!data.success) throw new Error(data.error?.message || '鉴定失败');

        const r = data.result;
        showResult({
          score: r.overallScore ?? 80,
          grade: r.grade ?? '良好',
          type: r.jadeType ?? '未知',
          origin: r.origin ?? '未知',
          color: r.color ?? '未知',
          transparency: r.transparency ?? '—',
          texture: r.texture ?? '—',
          craft: r.craft ?? '—',
          isNatural: r.isNatural ?? true,
          authenticity: r.authenticity ?? '—',
          price: r.estimatedPrice ?? 0,
          advice: r.advice ?? '请咨询专业鉴定机构。',
          careTips: r.careTips ?? []
        });
      } catch (err) {
        notify('AI鉴定失败：' + err.message, 'error');
      }
    } else {
      // 演示模式
      for (const delay of steps) {
        await new Promise(r => setTimeout(r, delay));
      }
      showResult(generateMockResult());
    }

    setProcessing(false);
  };

  const showResult = (r) => {
    setResult(r);
    let s = 0;
    const t = setInterval(() => {
      s++;
      setAnimScore(s);
      if (s >= r.score) clearInterval(t);
    }, 20);
    notify('鉴定完成！');
    setTimeout(() => {
      document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const downloadReport = () => {
    if (!result) return;
    const text = `
玉石鉴定报告
=====================================
鉴定编号：WD-${Date.now().toString().slice(-8)}
鉴定日期：${new Date().toLocaleDateString('zh-CN')}

【综合评分】
评分：${result.score} 分
等级：${result.grade}

【玉石信息】
种类：${result.type}
产地：${result.origin}
颜色：${result.color}
透明度：${result.transparency}
质地：${result.texture}
雕工：${result.craft}

【真伪鉴别】
${result.authenticity}

【价格评估】
参考价格：¥${result.price.toLocaleString()}
参考区间：¥${Math.floor(result.price*0.6).toLocaleString()} ~ ¥${Math.floor(result.price*1.4).toLocaleString()}

【购买建议】
${result.advice}

【保养提示】
${result.careTips.map((t,i)=>`${i+1}. ${t}`).join('\n')}

=====================================
【免责声明】
本报告由AI智能鉴定系统生成，仅供参考。
如需权威鉴定结果，请咨询国家珠宝玉石质量监督检验中心（NGTC）等专业机构。

玉韵 JadeCharm
    `.trim();

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    a.download = `玉石鉴定报告_${Date.now()}.txt`;
    a.click();
    notify('报告已下载');
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setAnimScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <h2 className="page-hero-title">专业鉴定</h2>
          <p className="page-hero-en">AI Jade Appraisal</p>
          <p className="page-hero-desc">AI视觉模型，专业分析玉石种水色质与真伪</p>
        </div>
      </div>

      <div className="standard-layout">
        {/* ── 说明卡 ─────────────────────────────── */}
        <div className="how-it-works" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="steps-grid">
            {steps.map(s => (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI模式切换 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '24px',
          fontSize: '0.88rem',
          color: 'var(--text-soft)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useRealAI}
              onChange={e => setUseRealAI(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>使用真实AI模型（需配置API Key，否则使用演示模式）</span>
          </label>
        </div>

        <div className="appraisal-layout">
          {/* ── 上传面板 ─────────────────────────── */}
          <div className="upload-panel">
            <div className="upload-header">
              <h3>上传玉石图片</h3>
              <p>支持 JPG / PNG / WEBP，单图最大 10MB，最多 6 张</p>
            </div>

            {files.length === 0 ? (
              <div
                className={`upload-zone${isDrag ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div className="upload-icon">📷</div>
                <h4>拖拽图片到此处</h4>
                <p>或点击选择文件</p>
                <button className="btn btn-primary" style={{ marginTop: '16px' }}>选择图片</button>
              </div>
            ) : (
              <div className="preview-area">
                <div
                  className={`upload-zone${isDrag ? ' drag-over' : ''}`}
                  style={{ padding: '16px', marginBottom: '0' }}
                  onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                  onDragLeave={() => setIsDrag(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    点击或拖拽继续添加图片（{files.length}/6）
                  </p>
                </div>
                <p className="preview-title" style={{ marginTop: '12px' }}>已上传 {files.length} 张图片：</p>
                <div className="preview-grid">
                  {files.map((item, i) => (
                    <div className="preview-thumb" key={i}>
                      <img src={item.url} alt={`预览${i+1}`} />
                      <button className="remove-thumb" onClick={() => remove(i)} title="删除">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="identify-btn-wrap">
              <button
                className="btn-identify"
                onClick={handleIdentify}
                disabled={processing || files.length === 0}
              >
                {processing ? (
                  <>
                    <span className="spinner" />
                    AI 鉴定中...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    开始 AI 智能鉴定
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── 结果面板 ─────────────────────────── */}
          <div className="result-panel" id="result-panel">
            <div className="result-header">
              <h3>鉴定报告</h3>
              <p>由 AI 视觉模型综合分析生成</p>
            </div>

            {!result ? (
              <div className="result-empty">
                <div className="result-empty-icon">玉</div>
                <p>上传玉石图片后点击"开始鉴定"<br />AI 将为您生成专业鉴定报告</p>
              </div>
            ) : (
              <div className="result-body">
                {/* 分数 */}
                <div className="score-ring-wrap">
                  <div
                    className="score-ring"
                    style={{ background: `conic-gradient(var(--gold-main) ${animScore * 3.6}deg, var(--border-light) ${animScore * 3.6}deg)` }}
                  >
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                      <span className="score-num">{animScore}</span>
                      <span className="score-unit">分</span>
                    </div>
                  </div>
                  <div className="grade-badge" style={{ marginTop: '8px' }}>
                    <span className={`grade-badge grade-${result.grade === '优质' ? 'excellent' : result.grade === '良好' ? 'good' : 'average'}`}>
                      {result.grade}
                    </span>
                  </div>
                </div>

                {/* 详情表 */}
                <table className="detail-table">
                  <tbody>
                    {[
                      ['玉石种类', result.type],
                      ['产地来源', result.origin],
                      ['颜色等级', result.color],
                      ['透明度',   result.transparency],
                      ['质地评级', result.texture],
                      ['雕工评级', result.craft]
                    ].map(([k, v]) => (
                      <tr key={k}><td>{k}</td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>

                {/* 真伪 */}
                <div className="auth-badges">
                  <span className={`auth-badge ${result.isNatural ? 'real' : 'fake'}`}>
                    {result.isNatural ? '✓' : '✕'} {result.authenticity}
                  </span>
                </div>

                {/* 价格 */}
                <div className="price-box">
                  <p className="price-label">市场参考价格</p>
                  <p className="price-main">¥{result.price.toLocaleString()}</p>
                  <p className="price-range">
                    区间：¥{Math.floor(result.price*0.6).toLocaleString()} ~ ¥{Math.floor(result.price*1.4).toLocaleString()}
                  </p>
                </div>

                {/* 建议 */}
                <div className="advice-block">
                  <h4 className="block-title">购买建议</h4>
                  <p className="advice-text">{result.advice}</p>
                </div>

                {/* 保养 */}
                <div className="tips-block">
                  <h4 className="block-title">保养建议</h4>
                  <ul className="tips-list">
                    {result.careTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="disclaimer">
                  ⚠ 本报告由 AI 智能鉴定系统生成，仅供参考，不构成商业购买依据。
                  如需权威鉴定，请联系国家珠宝玉石质量监督检验中心（NGTC）等专业机构。
                </div>
              </div>
            )}

            {result && (
              <div className="result-actions">
                <button className="btn btn-ghost" onClick={reset}>重新鉴定</button>
                <button className="btn btn-primary" onClick={downloadReport}>下载报告</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
}
