import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";
import "./PortfolioEdit.css";

const PortfolioEdit: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const token = localStorage.getItem("access_token") ?? "";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // URLのuserIdとログインユーザーのIDが一致するかチェック
    if (userId !== user?.id) {
      // 権限がない場合は自分のプロフィール編集ページにリダイレクト
      navigate(`/portfolio/${user?.id}/edit`);
      return;
    }

    // 既存のプロフィールを取得する
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/portfolio/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // 既存のプロフィールが見つかった場合
          const dto = await res.json();
          console.log("Loaded existing profile:", dto);

          setProfile({
            id: String(dto.userId || userId),
            userId: String(dto.userId || userId),
            name: dto.name || "",
            nameKana: dto.nameKana || "",
            company: dto.company || "",
            occupation: dto.occupation || "",
            description: dto.description || "",
            nameCardImgUrl: dto.nameCardImgUrl || "",
            skills: [],
            interests: [],
            contactInfo: {
              email: "",
              phone: "",
              sns: {
                twitter: "",
                linkedin: "",
                github: "",
                instagram: "",
              },
              website: "",
            },
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (res.status === 404) {
          // プロフィールが存在しない場合は新規作成用の空のプロフィール
          console.log("No existing profile found, creating new one");
          const emptyProfile: Profile = {
            id: "",
            userId: user?.id || "",
            name: "",
            nameKana: "",
            company: "",
            occupation: "",
            description: "",
            skills: [],
            interests: [],
            contactInfo: {
              email: "",
              phone: "",
              sns: {
                twitter: "",
                linkedin: "",
                github: "",
                instagram: "",
              },
              website: "",
            },
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProfile(emptyProfile);
        } else {
          throw new Error(`Failed to load profile: ${res.status}`);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        // エラーの場合も空のプロフィールで初期化
        const emptyProfile: Profile = {
          id: "",
          userId: user?.id || "",
          name: "",
          nameKana: "",
          company: "",
          occupation: "",
          description: "",
          skills: [],
          interests: [],
          contactInfo: {
            email: "",
            phone: "",
            sns: {
              twitter: "",
              linkedin: "",
              github: "",
              instagram: "",
            },
            website: "",
          },
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setProfile(emptyProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user, navigate, userId, token]);

  // Cardを表にしたり裏返したり
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

  const handleSave = async () => {
    if (!profile) return;

    // 必須チェック
    if (!profile.name?.trim()) {
      alert("氏名は必須です");
      return;
    }
    if (!profile.nameKana?.trim()) {
      alert("氏名（ふりがな）は必須です");
      return;
    }
    if (!profile.company?.trim()) {
      alert("会社名は必須です");
      return;
    }
    if (!profile.occupation?.trim()) {
      alert("役職は必須です");
      return;
    }
    if (!profile.description?.trim()) {
      alert("自己紹介は必須です");
      return;
    }

    setIsSaving(true);

    // API呼び出し
    try {
      console.log("Debug - user:", user);
      console.log("Debug - profile.userId:", profile.userId);
      console.log("Debug - profile.id:", profile.id);

      // バックエンドDTOに合わせて組み替え
      const dto = {
        userId: parseInt(profile.userId), // バックエンドはInteger型を期待
        name: profile.name,
        nameKana: profile.nameKana,
        company: profile.company,
        occupation: profile.occupation,
        description: profile.description,
        nameCardImgUrl: null,
      };

      const method = profile.id ? "PUT" : "POST";
      const url = profile.id
        ? `/api/portfolio/${parseInt(profile.userId)}`
        : "/api/portfolio";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("認証が切れました。ログインし直してください。");
          return;
        }
        const text = await res.text().catch(() => "");
        throw new Error(`保存に失敗しました: ${res.status} ${text}`);
      }

      alert("プロフィールを保存しました！");
      navigate(`/portfolio/${user?.id ?? ""}`);
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました。もう一度お試しください。");
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
            <label htmlFor="name">
              氏名<span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={profile.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="氏名を入力"
              required
            />
          </div>

          {/* 氏名カナ（必須） */}
          <div className="form-group">
            <label htmlFor="nameKana">
              氏名（ふりがな） <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nameKana"
              value={profile.nameKana || ""}
              onChange={(e) => handleInputChange("nameKana", e.target.value)}
              placeholder="ヤマダ タロウ"
              required
            />
          </div>

          {/* 自己紹介 */}
          <div className="form-group">
            <label htmlFor="bio">
              自己紹介<span className="required">*</span>
            </label>
            <textarea
              id="bio"
              value={profile.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="あなたについて教えてください"
              rows={5}
              required
            />
          </div>

          {/* 会社情報 */}
          <div className="form-group">
            <label htmlFor="company">
              会社名<span className="required">*</span>
            </label>
            <input
              type="text"
              id="company"
              value={profile.company || ""}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="会社名を入力"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">
              役職<span className="required">*</span>
            </label>
            <input
              type="text"
              id="occupation"
              value={profile.occupation || ""}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
              placeholder="役職を入力"
              required
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
          {/* <div className="form-group">
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
          </div> */}

          {/* 趣味・興味 */}
          {/* <div className="form-group">
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
          </div> */}

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

export default PortfolioEdit;
