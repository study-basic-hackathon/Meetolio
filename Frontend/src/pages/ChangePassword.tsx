import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ChangePasswordForm } from "../types";
import "./ChangePassword.css";

const ChangePassword: React.FC = () => {
  const { isAuthenticated, isAuthReady, logout } = useAuth(); // ← update
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ChangePasswordForm>>({});

  // ★ 認証判定が完了するまで待って、未ログインならログインへ
  useEffect(() => {
    if (!isAuthReady) return; // まずは待つ
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthReady, isAuthenticated, navigate]);

  const handleInputChange = (
    field: keyof ChangePasswordForm,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordForm> = {};
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "現在のパスワードを入力してください";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "新しいパスワードを入力してください";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "パスワードは8文字以上で入力してください";
    }
    if (!formData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "新しいパスワードを再入力してください";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "パスワードが一致しません";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthReady) return; // 判定前は送らない
    if (!isAuthenticated) {
      // 念のための二重ガード
      navigate("/login", { replace: true });
      return;
    }
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token") ?? ""; // ★ 毎回読む
      const res = await fetch("/api/account/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          // ※ バックエンドが不要なら confirm は送らなくてOK
          confirmNewPassword: formData.confirmNewPassword,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // ★ セッション無効時は確実に破棄してログインへ
          logout();
          alert("認証が切れました。ログインし直してください。");
          navigate("/login", { replace: true });
          return;
        }
        throw new Error("パスワード変更に失敗しました");
      }

      alert("パスワードを変更しました");
      navigate("/settings", { replace: true });
    } catch (error) {
      console.error("パスワードの変更に失敗しました:", error);
      alert("パスワードの変更に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  // ★ 認証判定が終わるまでローディング表示
  if (!isAuthReady) {
    return (
      <div className="change-password">
        <div className="container">
          <div className="loading">認証確認中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="change-password">
      <div className="container">
        <div className="edit-form">
          <div className="form-header">
            <h2 className="form-title">パスワード変更</h2>
            <p className="form-description">
              新しいパスワードに変更するには、現在のパスワードの入力が必要です。
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 現在のパスワード */}
            <div className="form-group">
              <label htmlFor="currentPassword">現在のパスワード</label>
              <input
                type="password"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                placeholder="現在のパスワード"
                className={errors.currentPassword ? "error" : ""}
              />
              {errors.currentPassword && (
                <div className="error-message">{errors.currentPassword}</div>
              )}
            </div>

            {/* 新しいパスワード */}
            <div className="form-group">
              <label htmlFor="newPassword">新しいパスワード</label>
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="新しいパスワード（8文字以上）"
                className={errors.newPassword ? "error" : ""}
              />
              {errors.newPassword && (
                <div className="error-message">{errors.newPassword}</div>
              )}
            </div>

            {/* 新しいパスワード確認 */}
            <div className="form-group">
              <label htmlFor="confirmNewPassword">新しいパスワード確認</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={(e) =>
                  handleInputChange("confirmNewPassword", e.target.value)
                }
                placeholder="新しいパスワードを再入力"
                className={errors.confirmNewPassword ? "error" : ""}
              />
              {errors.confirmNewPassword && (
                <div className="error-message">{errors.confirmNewPassword}</div>
              )}
            </div>

            {/* ボタン */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving || !isAuthenticated} // ← 未ログイン送信防止
              >
                {isSaving ? "変更中..." : "変更する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
