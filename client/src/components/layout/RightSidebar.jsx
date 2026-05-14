import { jade_ranking } from '../../data/jadeData';

export default function RightSidebar() {
  return (
    <aside className="sidebar sidebar-right">
      <div className="sidebar-block">
        <div>
          <h3 className="sidebar-title">热门玉石排行</h3>
          <ol className="rank-list">
            {jade_ranking.map((name, i) => (
              <li className="rank-item" key={i}>
                <span className="rank-num">{i + 1}</span>
                <span className="rank-name">{name}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="sidebar-title">玉言诗韵</h3>
          <div className="poem-box">
            <p className="poem-text">「兰陵美酒郁金香，<br />玉碗盛来琥珀光。」</p>
            <cite className="poem-cite">—— 唐·李白</cite>
          </div>
        </div>

        <div>
          <h3 className="sidebar-title">玉之五德</h3>
          <div className="poem-box">
            <p className="poem-text" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              仁 · 义 · 礼 · 智 · 信
            </p>
            <cite className="poem-cite">君子比德于玉 ——《礼记》</cite>
          </div>
        </div>

        <div>
          <h3 className="sidebar-title">AI 鉴定</h3>
          <div className="know-card" style={{ textAlign: 'center' }}>
            <p className="know-q" style={{ marginBottom: '8px' }}>智能玉石鉴别</p>
            <p className="know-a" style={{ marginBottom: '10px' }}>
              上传玉石图片，AI 为您智能分析真伪、种类与价值。
            </p>
            <a
              href="/appraisal"
              style={{
                display: 'inline-block',
                padding: '5px 14px',
                background: 'var(--jade-dark)',
                color: 'white',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 500
              }}
            >
              立即鉴定 →
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
