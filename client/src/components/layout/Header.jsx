import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { to: '/',          label: '首页' },
  { to: '/gallery',   label: '玉石鉴赏' },
  { to: '/culture',   label: '文化典藏' },
  { to: '/creation',  label: '玉石创作' },
  { to: '/appraisal', label: '专业鉴定' }
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由切换时关闭菜单
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="site-logo" onClick={closeMenu}>
          <span className="logo-jade-char">玉</span>
          <div className="logo-text-wrap">
            <h1>玉韵</h1>
            <p className="logo-tagline">Jade Charm · Classic Appreciation</p>
          </div>
        </Link>

        <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`menu-btn${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="菜单"
          aria-expanded={menuOpen}
        >
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
      </div>

      <div className="header-cloud" aria-hidden="true" />
    </header>
  );
}
