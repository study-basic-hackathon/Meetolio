import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";

import "./BusinessCardEdit.css";

const BusinessCardEdit: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<{
    front?: string;
    back?: string;
  }>({});

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
      nameKana: "たなか たろう",
      company: "テック株式会社",
      occupation: "フロントエンドエンジニア",
      description:
        "Web開発に携わって5年目です。React、TypeScript、Node.jsを中心に開発を行っています。ユーザビリティを重視した設計を心がけています。",
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

  const handleImageUpload = (side: "front" | "back", file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImages((prev) => ({
        ...prev,
        [side]: result,
      }));
      console.log(`${side}面の画像をアップロードしました:`, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      // モックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      console.log("名刺を保存しました:", profile);
      console.log("アップロードされた画像:", uploadedImages);
      navigate(`/portfolio/${user?.id}/edit`);
    } catch (error) {
      console.error("名刺の保存に失敗しました:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/portfolio/${user?.id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="business-card-edit">
        <div className="container">
          <div className="loading">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="business-card-edit">
        <div className="container">
          <div className="error">プロフィールが見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-card-edit">
      <div className="container">
        <div className="edit-form">
          {/* 名刺プレビュー（表面・裏面） */}
          <div className="form-group">
            <label>現在の名刺</label>
            <div className="card-preview-container">
              <div className="preview-section">
                <h4 className="preview-title">表面</h4>
                <div className="card-preview-item">
                  <img
                    src={uploadedImages.front || "/img/sample.jpeg"}
                    alt="名刺（表面）"
                    className="card-preview-image"
                  />
                </div>
                <div className="preview-actions">
                  <div className="action-item">
                    <button
                      type="button"
                      className="action-btn upload-btn"
                      onClick={() => {
                        const input = document.getElementById(
                          "front-upload"
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      ⬆
                    </button>
                    <input
                      type="file"
                      id="front-upload"
                      accept="image/*"
                      className="file-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload("front", file);
                        }
                      }}
                    />
                    <span className="action-label">画像をアップロード</span>
                  </div>
                  <div className="action-item">
                    <button
                      type="button"
                      className="action-btn design-btn"
                      onClick={() => navigate("/business-card/design")}
                    >
                      ✏
                    </button>
                    <span className="action-label">自分でデザイン</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4 className="preview-title">裏面</h4>
                <div className="card-preview-item">
                  <img
                    src={uploadedImages.back || "/img/sample2.jpeg"}
                    alt="名刺（裏面）"
                    className="card-preview-image"
                  />
                </div>
                <div className="preview-actions">
                  <div className="action-item">
                    <button
                      type="button"
                      className="action-btn upload-btn"
                      onClick={() => {
                        const input = document.getElementById(
                          "back-upload"
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      ⬆
                    </button>
                    <input
                      type="file"
                      id="back-upload"
                      accept="image/*"
                      className="file-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload("back", file);
                        }
                      }}
                    />
                    <span className="action-label">画像をアップロード</span>
                  </div>
                  <div className="action-item">
                    <button
                      type="button"
                      className="action-btn design-btn"
                      onClick={() => navigate("/business-card/design")}
                    >
                      ✏
                    </button>
                    <span className="action-label">自分でデザイン</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardEdit;
