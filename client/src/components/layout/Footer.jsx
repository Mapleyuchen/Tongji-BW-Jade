import { Link } from 'react-router-dom';

const links = [
  { to: '/',          label: '首页' },
  { to: '/gallery',   label: '玉石鉴赏' },
  { to: '/culture',   label: '文化典藏' },
  { to: '/creation',  label: '玉石创作' },
  { to: '/appraisal', label: '专业鉴定' }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-logo-wrap">
          <span className="footer-jade-char">玉</span>
          <span className="footer-brand">玉韵</span>
        </div>

        <nav className="footer-links">
          {links.map(item => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </nav>

        <div className="footer-divider" />

        <p className="footer-copy">© 2026 玉韵 JadeCharm · 传承千年玉文化</p>
        <p className="footer-sub">同济大学《玉石学》课程大作业</p>
      </div>
    </footer>
  );
}
