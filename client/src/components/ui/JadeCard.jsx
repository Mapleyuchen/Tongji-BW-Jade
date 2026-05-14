export default function JadeCard({ jade, onClick }) {
  return (
    <article className="jade-card" onClick={() => onClick?.(jade)}>
      <div className="card-img-wrap">
        <img src={jade.image} alt={jade.name} loading="lazy" />
        <span className="card-cat-tag">{jade.categoryName}</span>
        <div className="card-overlay">
          <button className="card-view-btn" tabIndex={-1}>查看详情</button>
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{jade.name}</h3>
        <p className="card-desc">{jade.description}</p>
        <div className="card-tags">
          {jade.tags.map(tag => (
            <span className="card-tag" key={tag}>{tag}</span>
          ))}
        </div>
        {jade.price && <p className="card-price">{jade.price}</p>}
      </div>
    </article>
  );
}
