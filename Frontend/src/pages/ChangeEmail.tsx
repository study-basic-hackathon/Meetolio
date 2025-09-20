import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ChangeEmailForm } from "../types";
import "./ChangeEmail.css";

const ChangeEmail: React.FC = () => {
  const { user, updateUser, isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangeEmailForm>({
    currentEmail: user?.email || "",
    newEmail: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ChangeEmailForm>>({});

  // 認証チェック
  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isAuthReady, navigate]);

  const handleInputChange = (field: keyof ChangeEmailForm, value: string) => {
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
    const newErrors: Partial<ChangeEmailForm> = {};

    if (!formData.currentEmail.trim()) {
      newErrors.currentEmail = "現在のメールアドレスを入力してください";
    }

    if (!formData.newEmail.trim()) {
      newErrors.newEmail = "新しいメールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.newEmail = "有効なメールアドレスを入力してください";
    }

    if (!formData.password.trim()) {
      newErrors.password = "パスワードを入力してください";
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
      const res = await fetch("/api/account/me/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          email: formData.newEmail,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error("メールアドレスの変更に失敗しました");
      }

      // ユーザー情報を更新
      if (user) {
        const updatedUser = {
          ...user,
          email: formData.newEmail,
        };
        updateUser(updatedUser);
      }

      alert("メールアドレスを変更しました");
      console.log("メールアドレスを変更しました", formData);
      navigate("/settings");
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        newEmail: (err as Error).message,
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  // 認証されていない場合やユーザー情報がない場合
  if (!isAuthenticated || !user) {
    return null;
  }
  return (
    <div className="change-email">
      <div className="container">
        <div className="edit-form">
          <div className="form-header">
            <h2 className="form-title">メールアドレス変更</h2>
            <p className="form-description">
              新しいメールアドレスに変更するには、現在のパスワードの入力が必要です。
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 現在のメールアドレス */}
            <div className="form-group">
              <label htmlFor="currentEmail">現在のメールアドレス</label>
              <input
                type="email"
                id="currentEmail"
                value={formData.currentEmail}
                onChange={(e) =>
                  handleInputChange("currentEmail", e.target.value)
                }
                placeholder="現在のメールアドレス"
                disabled
                className="readonly-field"
              />
            </div>

            {/* 新しいメールアドレス */}
            <div className="form-group">
              <label htmlFor="newEmail">新しいメールアドレス</label>
              <input
                type="email"
                id="newEmail"
                value={formData.newEmail}
                onChange={(e) => handleInputChange("newEmail", e.target.value)}
                placeholder="新しいメールアドレス"
                className={errors.newEmail ? "error" : ""}
              />
              {errors.newEmail && (
                <div className="error-message">{errors.newEmail}</div>
              )}
            </div>

            {/* パスワード */}
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="現在のパスワード"
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
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

export default ChangeEmail;
