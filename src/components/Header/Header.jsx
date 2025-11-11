import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`app-header fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? 'scrolled' : ''
      }`}
      role="banner"
      aria-expanded={mobileMenu}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h3 className="mb-0 fw-bold brand">EV DataHub</h3>
        </div>

        {/* Desktop Menu */}
        <nav className="d-none d-lg-flex gap-4 align-items-center desktop-nav">
          <a href="#features" className="text-dark text-decoration-none fw-medium">Tính năng</a>
          <a href="#categories" className="text-dark text-decoration-none fw-medium">Danh mục</a>
          <a href="#how-it-works" className="text-dark text-decoration-none fw-medium">Hoạt động</a>
          <a href="#stats" className="text-dark text-decoration-none fw-medium">Thống kê</a>
          <Button type="link" href="/login" className="text-dark fw-medium">Đăng nhập</Button>
          <Button type="primary" className="btn-primary-custom" href="/register">
            Đăng ký miễn phí
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="d-lg-none toggle-btn btn btn-link"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label={mobileMenu ? 'Đóng menu' : 'Mở menu'}
        >
          {mobileMenu ? <CloseOutlined style={{ fontSize: 22 }} /> : <MenuOutlined style={{ fontSize: 22 }} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu position-fixed start-0 end-0 ${mobileMenu ? 'open' : ''}`}
        style={{ top: '72px', zIndex: 49 }}
      >
        <div className="container py-3">
          <a href="#features" className="d-block py-2 text-dark">Tính năng</a>
          <a href="#categories" className="d-block py-2 text-dark">Danh mục</a>
          <a href="#how-it-works" className="d-block py-2 text-dark">Hoạt động</a>
          <a href="#stats" className="d-block py-2 text-dark">Thống kê</a>
          <div className="mt-3">
            <Button block type="primary" className="btn-primary-custom mb-2" href="/register">
              Đăng ký miễn phí
            </Button>
            <Button block type="link" href="/login">Đăng nhập</Button>
          </div>
        </div>
      </div>
    </header>
  );
}