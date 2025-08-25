import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Profile } from "../types";
import "./ProfileEdit.css";

const ProfileEdit: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // モックプロフィールデータを取得
    const mockProfile: Profile = {
      id: "1",
      userId: user?.id || "1",
      name: user?.name || "田中太郎",
      company: "テック株式会社",
      jobTitle: "フロントエンドエンジニア",
      bio: "Web開発に携わって5年目です。React、TypeScript、Node.jsを中心に開発を行っています。ユーザビリティを重視した設計を心がけています。",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "CSS",
        "HTML",
        "JavaScript",
        "Git",
        "AWS",
      ],
      interests: ["プログラミング", "読書", "旅行", "料理", "音楽"],
      contactInfo: {
        email: "taro.tech@example.com",
        phone: "090-1234-5678",
        sns: {
          twitter: "taro_tech",
          linkedin: "taro-tech",
          github: "taro-tech",
          instagram: "taro_tech_dev",
        },
        website: "https://taro-tech.dev",
      },
      isPublic: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date(),
    };

    setProfile(mockProfile);
    setIsLoading(false);
  }, [isAuthenticated, user, navigate]);

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    if (!profile) return;

    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const handleContactInfoChange = (
    field: keyof Profile["contactInfo"],
    value: any
  ) => {
    if (!profile) return;

    setProfile({
      ...profile,
      contactInfo: {
        ...profile.contactInfo,
        [field]: value,
      },
    });
  };

  const handleSnsChange = (
    platform: keyof Profile["contactInfo"]["sns"],
    value: string
  ) => {
    if (!profile) return;

    setProfile({
      ...profile,
      contactInfo: {
        ...profile.contactInfo,
        sns: {
          ...profile.contactInfo.sns,
          [platform]: value,
        },
      },
    });
  };

  const handleSkillsChange = (skills: string[]) => {
    if (!profile) return;

    setProfile({
      ...profile,
      skills,
    });
  };

  const handleInterestsChange = (interests: string[]) => {
    if (!profile) return;

    setProfile({
      ...profile,
      interests,
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);

    try {
      // モックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      console.log("プロフィールを保存しました:", profile);
      navigate("/mypage");
    } catch (error) {
      console.error("プロフィールの保存に失敗しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-edit">
        <div className="container">
          <div className="loading">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-edit">
        <div className="container">
          <div className="error">プロフィールが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-edit">
      <div className="container">
        <div className="edit-form">
          {/* 名刺 */}
          <div className="business-card-section">
            {/* 名刺プレビュー（裏表タップ切り替え） */}
            <div className="card-preview-container">
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
                  />
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
                  />
                  <div className="flip-hint-overlay">
                    <p className="flip-hint">タップして表面に戻る</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 名刺変更ボタン */}
            <div className="card-edit-options">
              <button
                type="button"
                className="change-card-btn"
                onClick={() => {
                  navigate("/business-card/edit");
                }}
              >
                名刺を変更
              </button>
            </div>
          </div>

          {/* 氏名 */}
          <div className="form-group">
            <label htmlFor="name">氏名</label>
            <input
              type="text"
              id="name"
              value={profile.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="氏名を入力"
            />
          </div>

          {/* 自己紹介 */}
          <div className="form-group">
            <label htmlFor="bio">自己紹介</label>
            <textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="あなたについて教えてください"
              rows={5}
            />
          </div>

          {/* 会社情報 */}
          <div className="form-group">
            <label htmlFor="company">会社名</label>
            <input
              type="text"
              id="company"
              value={profile.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="会社名を入力"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobTitle">役職</label>
            <input
              type="text"
              id="jobTitle"
              value={profile.jobTitle || ""}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="役職を入力"
            />
          </div>

          {/* 連絡先 */}
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={profile.contactInfo.email}
              onChange={(e) => handleContactInfoChange("email", e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">ウェブサイト</label>
            <input
              type="url"
              id="website"
              value={profile.contactInfo.website || ""}
              onChange={(e) =>
                handleContactInfoChange("website", e.target.value)
              }
              placeholder="https://example.com"
            />
          </div>

          {/* SNS */}
          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              id="twitter"
              value={profile.contactInfo.sns.twitter || ""}
              onChange={(e) => handleSnsChange("twitter", e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="text"
              id="github"
              value={profile.contactInfo.sns.github || ""}
              onChange={(e) => handleSnsChange("github", e.target.value)}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              value={profile.contactInfo.sns.linkedin || ""}
              onChange={(e) => handleSnsChange("linkedin", e.target.value)}
              placeholder="username"
            />
          </div>

          {/* スキル */}
          <div className="form-group">
            <label>スキル・専門分野</label>
            <div className="tags-input">
              <div className="tags-display">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="tag skill-tag">
                    {skill}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => {
                        const newSkills = profile.skills.filter(
                          (_, i) => i !== index
                        );
                        handleSkillsChange(newSkills);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="スキルを入力してEnter"
                className="tag-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const value = input.value.trim();
                    if (value && !profile.skills.includes(value)) {
                      handleSkillsChange([...profile.skills, value]);
                      input.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* 趣味・興味 */}
          <div className="form-group">
            <label>趣味・興味</label>
            <div className="tags-input">
              <div className="tags-display">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="tag interest-tag">
                    {interest}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => {
                        const newInterests = profile.interests.filter(
                          (_, i) => i !== index
                        );
                        handleInterestsChange(newInterests);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="趣味・興味を入力してEnter"
                className="tag-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const value = input.value.trim();
                    if (value && !profile.interests.includes(value)) {
                      handleInterestsChange([...profile.interests, value]);
                      input.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
