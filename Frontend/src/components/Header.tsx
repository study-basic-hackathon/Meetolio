import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    closeMobileMenu();
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  // 認証済み&認証ページ以外のときだけナビを表示
  const showHamburger = isAuthenticated && !isAuthPage;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* ロゴは常に表示 */}
          <div
            className="logo"
            onClick={() => {
              // 認証済みの場合はマイページへ、未認証の場合はログインページへ
              if (isAuthenticated && user) {
                navigate("/portfolio");
              } else {
                navigate("/login");
              }
              closeMobileMenu();
            }}
          >
            <h1>Meetolio</h1>
          </div>

          {/* ナビ関連 */}
          {showHamburger && (
            <>
              <button
                className={`mobile-menu-toggle ${
                  isMobileMenuOpen ? "active" : ""
                }`}
                onClick={toggleMobileMenu}
                aria-label="メニューを開く"
                aria-expanded={isMobileMenuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div
                className={`nav-overlay ${isMobileMenuOpen ? "active" : ""}`}
                onClick={closeMobileMenu}
              ></div>

              <nav className={`nav ${isMobileMenuOpen ? "active" : ""}`}>
                <div className="nav-links">
                  <Link
                    to="/portfolio"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    ホーム
                  </Link>
                  <Link
                    to="/portfolio/edit"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    プロフィール編集
                  </Link>
                  <Link
                    to="/settings"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    設定
                  </Link>
                </div>
                <div className="nav-actions">
                  <button onClick={handleLogout} className="btn btn-logout">
                    ログアウト
                  </button>
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
