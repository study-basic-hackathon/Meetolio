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

  // ログイン/新規登録ページ判定（必要なら他の非表示ページも足せる）
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  // 認証済み かつ 認証ページ以外のときだけナビを表示
  const showNav = isAuthenticated && !isAuthPage;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* ロゴは常に表示（ログイン画面でもOK） */}
          <div
            className="logo"
            onClick={() => {
              // 認証済みの場合はマイページへ、未認証の場合はログインページへ
              if (isAuthenticated && user) {
                navigate("/mypage");
              } else {
                navigate("/login");
              }
              closeMobileMenu();
            }}
          >
            <h1>Meetolio</h1>
          </div>

          {/* 以下、ナビ関連は showNav のときだけ描画 */}
          {showNav && (
            <>
              {/* ハンバーガーメニューボタン */}
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

              {/* モバイルメニューのオーバーレイ */}
              <div
                className={`nav-overlay ${isMobileMenuOpen ? "active" : ""}`}
                onClick={closeMobileMenu}
              ></div>

              <nav className={`nav ${isMobileMenuOpen ? "active" : ""}`}>
                <div className="nav-links">
                  <Link
                    to="/mypage"
                    className="nav-link"
                    onClick={handleNavLinkClick}
                  >
                    マイページ
                  </Link>
                  <Link
                    to="/profile/edit"
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
