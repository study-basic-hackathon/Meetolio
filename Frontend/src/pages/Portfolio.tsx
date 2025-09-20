import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";
import "./Portfolio.css";

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const targetUserId = userId || user?.id || "";
      if (!targetUserId) return;

      try {
        const res = await fetch(`/api/portfolio/${targetUserId}`);
        console.log("Portfolio API response status:", res.status);

        if (res.ok) {
          const dto = await res.json();
          console.log("Portfolio API response data:", dto);
          setProfile({
            id: String(dto.userId ?? targetUserId),
            userId: String(dto.userId ?? targetUserId),
            name: dto.name ?? "",
            nameKana: dto.nameKana ?? "",
            company: dto.company ?? "",
            occupation: dto.occupation ?? "",
            description: dto.description ?? "", // descriptionで統一
            nameCardImgUrl: dto.nameCardImgUrl ?? "",
            skills: [],
            interests: [],
            contactInfo: {
              email: "",
              phone: "",
              sns: {
                twitter: "",
                linkedin: "",
                facebook: "",
                instagram: "",
                github: "",
              },
              website: "",
            },
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (res.status === 404) {
          setProfile(null);
        } else {
          throw new Error("API error");
        }
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId, user]);

  if (isLoading) {
    return (
      <div className="mypage">
        <div className="container">
          <div className="loading">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mypage">
        <div className="container">
          <div className="empty-profile-section">
            <div className="empty-profile-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 14s1.5 2 4 2 4-2 4-2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 9h.01M15 9h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="empty-profile-content">
              <h2>プロフィールを作成しましょう</h2>
              <p>
                あなたの魅力的なプロフィールと名刺を作成して、
                <br />
                新しいつながりを築きませんか？
              </p>
              <div className="empty-profile-features">
                <div className="feature-item">
                  <span className="feature-icon">👤</span>
                  <span>プロフィール情報</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💼</span>
                  <span>デジタル名刺</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <span>オンライン共有</span>
                </div>
              </div>
              <button
                className="btn btn-primary btn-large create-profile-button"
                onClick={() => navigate(`/portfolio/${user?.id}/edit`)}
              >
                <span className="button-icon"></span>
                プロフィールを作成する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  // 表示するユーザー名を決定
  const displayName = profile?.name;

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
          {profile.description && (
            <div className="bio-section">
              <div className="bio-header">
                <div className="bio-header-left">
                  <div className="bio-company-name">{profile.company}</div>
                  <div className="bio-job-title">{profile.occupation}</div>
                  <div className="bio-person-name">{displayName}</div>
                  <div className="bio-person-furigana">{profile.nameKana}</div>
                </div>
                <div className="bio-header-right">
                  <div className="bio-icon">👤</div>
                </div>
              </div>
              <div className="bio-content">
                <p>{profile.description}</p>
              </div>
            </div>
          )}

          {/* SNSリンクセクション */}
          <div className="sns-section">
            <div className="sns-grid">
              {/* メール */}
              {profile.contactInfo.email && (
                <a
                  href={`mailto:${profile.contactInfo.email}`}
                  className="sns-card email-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="sns-icon">📧</div>
                  <div className="sns-info">
                    <span className="sns-label">メール</span>
                    <span className="sns-value">
                      {profile.contactInfo.email}
                    </span>
                  </div>
                </a>
              )}

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
          {/* <div className="skills-interests-section">
            <div className="skills-section">
              <h3 className="section-title">スキル・専門分野</h3>
              <div className="tags">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="tag skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div> */}

          {/* <div className="interests-section">
              <h3 className="section-title">趣味・興味</h3>
              <div className="tags">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="tag interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
