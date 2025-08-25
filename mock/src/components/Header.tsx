import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
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

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div
            className="logo"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/mypage");
              } else {
                navigate("/login");
              }
              closeMobileMenu();
            }}
          >
            <h1>Meetolio</h1>
          </div>

          {/* ハンバーガーメニューボタン */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="メニューを開く"
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
            {isAuthenticated ? (
              <>
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
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-full"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-full"
                  onClick={handleNavLinkClick}
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-full"
                  onClick={handleNavLinkClick}
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
