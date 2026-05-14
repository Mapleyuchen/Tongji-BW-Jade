import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Culture from './pages/Culture';
import Creation from './pages/Creation';
import Appraisal from './pages/Appraisal';

// 路由切换时滚动到顶部
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/culture"   element={<Culture />} />
        <Route path="/creation"  element={<Creation />} />
        <Route path="/appraisal" element={<Appraisal />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 'var(--nav-height)',
      gap: '16px',
      color: 'var(--text-soft)'
    }}>
      <div style={{ fontFamily: 'var(--font-brush)', fontSize: '5rem', color: 'var(--jade-dark)', opacity: 0.3 }}>玉</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--jade-dark)' }}>页面不存在</h2>
      <a href="/" style={{ color: 'var(--gold-main)', fontSize: '0.95rem' }}>← 返回首页</a>
    </div>
  );
}
