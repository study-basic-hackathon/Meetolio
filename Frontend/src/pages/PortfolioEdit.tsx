import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";
import "./PortfolioEdit.css";

const PortfolioEdit: React.FC = () => {
  const { user, isAuthenticated, isAuthReady, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCardFlipped] = useState(false);

  const [uploadedImage, setUploadedImage] = useState<string>();

  useEffect(() => {
    if (!isAuthReady) return;

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
        const token = getToken();
        const res = await fetch(`/api/portfolio/${userId}`, {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
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
            email: dto.email || "",
            twitter: dto.twitter || "",
            linkedin: dto.linkedin || "",
            github: dto.github || "",
            website: dto.website || "",
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
            email: "",
            twitter: "",
            linkedin: "",
            github: "",
            website: "",
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
          email: "",
          twitter: "",
          linkedin: "",
          github: "",
          website: "",
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
  }, [isAuthReady, isAuthenticated, user, navigate, userId, getToken]);

  const handleInputChange = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  // 画像アップロード
  const handleImageUpload = (file: File) => {
    // プレビュー用にはDataURLも保持
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
        name: profile.name,
        nameKana: profile.nameKana,
        company: profile.company,
        occupation: profile.occupation,
        description: profile.description,
        nameCardImgUrl: uploadedImage ?? profile.nameCardImgUrl ?? null,
        email: profile.email,
        twitter: profile.twitter,
        linkedin: profile.linkedin,
        github: profile.github,
        website: profile.website,
      };

      // POSTの場合はuserIdも含める
      if (!profile.id) {
        (dto as any).userId = parseInt(profile.userId);
      }

      const method = profile.id ? "PUT" : "POST";
      const url = profile.id
        ? `/api/portfolio/${parseInt(profile.userId)}`
        : "/api/portfolio";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken() ?? ""}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // トークンが無効な場合のみログアウト
          const token = getToken();
          if (!token) {
            logout();
            alert("認証が切れました。ログインし直してください。");
            navigate("/login");
            return;
          }
          // トークンが存在するのに401が返された場合は、他の原因の可能性があるため詳細なエラーメッセージを表示
          console.error("401 error with valid token:", token);
          alert(
            "認証エラーが発生しました。しばらく待ってから再試行してください。"
          );
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
              >
                {/* 名刺の表面 */}
                <div className="card-front">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="名刺（表面）"
                      className="card-image"
                    />
                  ) : profile.nameCardImgUrl ? (
                    <img
                      src={profile.nameCardImgUrl}
                      alt="名刺（表面）"
                      className="card-image"
                    />
                  ) : (
                    <p style={{ margin: 20 }}>
                      現在アップロードされている名刺はありません
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 名刺変更ボタン */}
            <div className="card-edit-options">
              <button
                type="button"
                className="change-card-btn"
                onClick={() => {
                  const input = document.getElementById("upload");
                  input?.click();
                }}
              >
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
                <span>名刺を変更</span>
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
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">ウェブサイト</label>
            <input
              type="url"
              id="website"
              value={profile.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {/* SNS */}
          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="text"
              id="twitter"
              value={profile.twitter || ""}
              onChange={(e) => handleInputChange("twitter", e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              type="text"
              id="github"
              value={profile.github || ""}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="text"
              id="linkedin"
              value={profile.linkedin || ""}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
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
