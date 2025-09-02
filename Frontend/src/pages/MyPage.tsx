import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";
import "./MyPage.css";

const MyPage: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    // ユーザーIDが指定されている場合はそのユーザーのプロフィールを表示
    // 指定されていない場合はログインユーザーのプロフィールを表示
    const targetUserId = userId || user?.id || "1";

    // モックプロフィールデータ
    const mockProfile: Profile = {
      id: "1",
      userId: targetUserId,
      name: user?.name || "テック 太郎",
      profileImageUrl:
        "https://via.placeholder.com/300x180/667eea/ffffff?text=Meetolio+名刺",
      jobTitle: "フロントエンドエンジニア",
      company: "株式会社テック",
      bio: "React、TypeScript、Node.jsを使用したWebアプリケーション開発に従事しています。ユーザー体験を重視したUI/UXデザインが得意です。新しい技術の習得と実践的なアプリケーション開発に情熱を持って取り組んでいます。",
      contactInfo: {
        email: "test@example.com",
        phone: "090-1234-5678",
        sns: {
          twitter: "@techdev",
          linkedin: "linkedin.com/in/techdev",
          facebook: "facebook.com/techdev",
          instagram: "@techdev",
          github: "github.com/techdev",
        },
        website: "https://techdev.example.com",
      },
      skills: ["React", "TypeScript", "Node.js", "CSS", "Git"],
      interests: ["Web開発", "UI/UX", "技術書", "カンファレンス"],
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProfile(mockProfile);
  }, [userId, user]);

  if (!profile) {
    return (
      <div className="mypage">
        <div className="container">
          <div className="loading">読み込み中...</div>
        </div>
      </div>
    );
  }

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // 表示するユーザー名を決定
  const displayName = user?.name || "テック 太郎";

  return (
    <div className="mypage">
      <div className="container">
        <div className="profile-section">
          {/* 名刺画像セクション */}
          <div className="business-card-section">
            <div className="card-container">
              <div
                className={`business-card ${isCardFlipped ? "flipped" : ""}`}
                onClick={handleCardFlip}
              >
                {/* 名刺の表面 */}
                <div className="card-front">
                  <img
                    src="/img/sample.jpeg"
                    alt="名刺（表面）"
                    className="card-image"
                    onError={(e) => {
                      // 画像が読み込めない場合のフォールバック
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  {/* フォールバック用のプレースホルダー */}
                  <div className="card-placeholder hidden">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">📇</div>
                      <p className="placeholder-text">名刺画像（表面）</p>
                      <p className="placeholder-subtext">
                        画像をアップロードしてください
                      </p>
                    </div>
                  </div>
                  <div className="flip-hint-overlay">
                    <p className="flip-hint">タップして裏面を見る</p>
                  </div>
                </div>

                {/* 名刺の裏面 */}
                <div className="card-back">
                  <img
                    src="/img/sample2.jpeg"
                    alt="名刺（裏面）"
                    className="card-image"
                    onError={(e) => {
                      // 画像が読み込めない場合のフォールバック
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  {/* フォールバック用のプレースホルダー */}
                  <div className="card-placeholder hidden">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">📇</div>
                      <p className="placeholder-text">名刺画像（裏面）</p>
                      <p className="placeholder-subtext">
                        画像をアップロードしてください
                      </p>
                    </div>
                  </div>
                  <div className="flip-hint-overlay">
                    <p className="flip-hint">タップして表面に戻る</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 自己紹介セクション */}
          {profile.bio && (
            <div className="bio-section">
              <div className="bio-header">
                <div className="bio-header-left">
                  <div className="bio-company-name">{profile.company}</div>
                  <div className="bio-job-title">{profile.jobTitle}</div>
                  <div className="bio-person-name">{displayName}</div>
                  <div className="bio-person-furigana">テック タロウ</div>
                </div>
                <div className="bio-header-right">
                  <div className="bio-icon">👤</div>
                </div>
              </div>
              <div className="bio-content">
                <p>{profile.bio}</p>
              </div>
            </div>
          )}

          {/* SNSリンクセクション */}
          <div className="sns-section">
            <div className="sns-grid">
              {/* メール */}
              <a
                href={`mailto:${profile.contactInfo.email}`}
                className="sns-card email-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="sns-icon">📧</div>
                <div className="sns-info">
                  <span className="sns-label">メール</span>
                  <span className="sns-value">{profile.contactInfo.email}</span>
                </div>
              </a>

              {/* 電話番号 */}
              {profile.contactInfo.phone && (
                <a
                  href={`tel:${profile.contactInfo.phone}`}
                  className="sns-card phone-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">📞</div>
                  <div className="sns-info">
                    <span className="sns-label">電話番号</span>
                    <span className="sns-value">
                      {profile.contactInfo.phone}
                    </span>
                  </div>
                </a>
              )}

              {/* ウェブサイト */}
              {profile.contactInfo.website && (
                <a
                  href={profile.contactInfo.website}
                  className="sns-card website-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">🌐</div>
                  <div className="sns-info">
                    <span className="sns-label">ウェブサイト</span>
                    <span className="sns-value">
                      {profile.contactInfo.website}
                    </span>
                  </div>
                </a>
              )}

              {/* Twitter */}
              {profile.contactInfo.sns?.twitter && (
                <a
                  href={`https://twitter.com/${profile.contactInfo.sns.twitter}`}
                  className="sns-card twitter-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">🐦</div>
                  <div className="sns-info">
                    <span className="sns-label">Twitter</span>
                    <span className="sns-value">
                      {profile.contactInfo.sns.twitter}
                    </span>
                  </div>
                </a>
              )}

              {/* LinkedIn */}
              {profile.contactInfo.sns?.linkedin && (
                <a
                  href={`https://${profile.contactInfo.sns.linkedin}`}
                  className="sns-card linkedin-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">💼</div>
                  <div className="sns-info">
                    <span className="sns-label">LinkedIn</span>
                    <span className="sns-value">
                      {profile.contactInfo.sns.linkedin}
                    </span>
                  </div>
                </a>
              )}

              {/* Facebook */}
              {profile.contactInfo.sns?.facebook && (
                <a
                  href={`https://${profile.contactInfo.sns.facebook}`}
                  className="sns-card facebook-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">📘</div>
                  <div className="sns-info">
                    <span className="sns-label">Facebook</span>
                    <span className="sns-value">
                      {profile.contactInfo.sns.facebook}
                    </span>
                  </div>
                </a>
              )}

              {/* Instagram */}
              {profile.contactInfo.sns?.instagram && (
                <a
                  href={`https://instagram.com/${profile.contactInfo.sns.instagram}`}
                  className="sns-card instagram-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">📷</div>
                  <div className="sns-info">
                    <span className="sns-label">Instagram</span>
                    <span className="sns-value">
                      {profile.contactInfo.sns.instagram}
                    </span>
                  </div>
                </a>
              )}

              {/* GitHub */}
              {profile.contactInfo.sns?.github && (
                <a
                  href={`https://github.com/${profile.contactInfo.sns.github}`}
                  className="sns-card github-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">💻</div>
                  <div className="sns-info">
                    <span className="sns-label">GitHub</span>
                    <span className="sns-value">
                      {profile.contactInfo.sns.github}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* スキル・興味セクション */}
          <div className="skills-interests-section">
            <div className="skills-section">
              <h3 className="section-title">スキル・専門分野</h3>
              <div className="tags">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="tag skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="interests-section">
              <h3 className="section-title">趣味・興味</h3>
              <div className="tags">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="tag interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
