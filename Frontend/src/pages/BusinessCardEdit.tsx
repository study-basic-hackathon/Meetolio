import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Profile } from "../types";

import "./BusinessCardEdit.css";

const BusinessCardEdit: React.FC = () => {
  const { user, isAuthenticated, getToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<{
    front?: string;
    back?: string;
  }>({});

  // 空のプロフィールを用意
  const emptyProfile: Profile = {
    id: "",
    userId: user?.id || "",
    name: "",
    nameKana: "",
    company: "",
    occupation: "",
    description: "",
    nameCardImgUrl: "",
    skills: [],
    interests: [],
    email: "",
    twitter: "",
    linkedin: "",
    github: "",
    website: "",
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [profile, setProfile] = useState<Profile>(emptyProfile);

  // 初期表示処理
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadProfile();

    setIsLoading(false);
  }, [isAuthenticated, user, navigate]);

  // プロフィール取得
  const loadProfile = async () => {
    try {
      const token = getToken();
      const res = await fetch(`/api/portfolio/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      });

      if (res.ok) {
        setProfile(await res.json());
        console.log(profile);
      } else {
        setProfile(emptyProfile);
      }
    } catch (error) {
      console.error("APIエラー：", error);
    }
  };

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
    try {
      // モックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
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

  return (
    <div className="business-card-edit">
      <div className="container">
        <div className="edit-form">
          {/* 名刺プレビュー（表面・裏面） */}
          <div className="form-group">
            <label>現在の名刺</label>
            <div className="card-preview-container">
              <div className="preview-section">
                <h4 className="preview-title"></h4>
                <div className="card-preview-item">
                  {uploadedImages.front ? (
                    <img
                      src={uploadedImages.front}
                      alt="名刺（表面）"
                      className="card-preview-image"
                    />
                  ) : profile.nameCardImgUrl ? (
                    <img
                      src={profile.nameCardImgUrl}
                      alt="名刺（表面）"
                      className="card-preview-image"
                    />
                  ) : (
                    <p style={{ margin: 20 }}>
                      現在アップロードされている名刺はありません
                    </p>
                  )}
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
