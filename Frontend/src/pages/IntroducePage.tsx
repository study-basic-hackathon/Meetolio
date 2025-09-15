import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./IntroducePage.css";

// Meetolioの紹介ページ（今は使用しない）
const IntroducePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Meetolio
              <span className="hero-subtitle">ミートリオ</span>
            </h1>
            <p className="hero-description">
              名刺管理アプリケーション + 自己紹介SNS
              <br />
              効率的な人脈管理とコミュニケーションを実現
            </p>

            {!isAuthenticated ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  無料で始める
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  ログイン
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/mypage" className="btn btn-primary btn-large">
                  マイページへ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">主な機能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>デジタル名刺管理</h3>
              <p>従来の紙の名刺をデジタル化し、効率的に管理できます。</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>人脈ネットワーク</h3>
              <p>
                ビジネスパーソン同士のつながりを構築し、新しい機会を見つけられます。
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>プロフィール検索</h3>
              <p>興味や専門分野でユーザーを検索し、適切な人脈を作れます。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="target-audience">
        <div className="container">
          <h2 className="section-title">こんな方におすすめ</h2>
          <div className="audience-grid">
            <div className="audience-item">
              <h4>ビジネスパーソン</h4>
              <p>効率的な名刺管理と人脈構築</p>
            </div>
            <div className="audience-item">
              <h4>フリーランス</h4>
              <p>新しいクライアントとの出会い</p>
            </div>
            <div className="audience-item">
              <h4>学生・起業家</h4>
              <p>将来のキャリアに繋がる人脈作り</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducePage;
