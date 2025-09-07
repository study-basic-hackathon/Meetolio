import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ChangePasswordForm } from "../types";
import "./ChangePassword.css";

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ChangePasswordForm>>({});

  const handleInputChange = (
    field: keyof ChangePasswordForm,
    value: string
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // エラーをクリア
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
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

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // モックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      console.log("パスワードを変更しました");
      navigate("/settings");
    } catch (error) {
      console.error("パスワードの変更に失敗しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/settings");
  };

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
                disabled={isSaving}
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
