import { jadeCategories, jade_knowledge, jade_ranking } from '../../data/jadeData';

export default function LeftSidebar({ activeFilter, onFilterChange }) {
  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-block">
        <div className="sidebar-divider">
          <span className="vert-text">品玉·悟道</span>
        </div>

        <div>
          <h3 className="sidebar-title">玉石分类</h3>
          <ul className="cat-list">
            {jadeCategories.map(cat => (
              <li key={cat.key}>
                <button
                  className={`cat-link${activeFilter === cat.key ? ' active' : ''}`}
                  onClick={() => onFilterChange?.(cat.key)}
                  style={{ width: '100%', textAlign: 'left', background: 'none' }}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="sidebar-title">今日推荐</h3>
          <div className="pick-card">
            <div className="pick-thumb">
              <img
                src="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&h=300&fit=crop"
                alt="翡翠观音"
                loading="lazy"
              />
            </div>
            <p className="pick-name">翡翠观音吊坠</p>
            <p className="pick-sub">色泽温润，雕工精细</p>
          </div>
        </div>

        <div>
          <h3 className="sidebar-title">玉石小知识</h3>
          <div className="know-cards">
            {jade_knowledge.map((item, i) => (
              <div className="know-card" key={i}>
                <p className="know-q">{item.q}</p>
                <p className="know-a">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
