import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { DeleteAccountForm } from "../types";
import "./DeleteAccount.css";

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState<DeleteAccountForm>({
    reason: "",
    password: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<DeleteAccountForm>>({});

  const handleInputChange = (field: keyof DeleteAccountForm, value: string) => {
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
    const newErrors: Partial<DeleteAccountForm> = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "退会理由を選択してください";
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

    setIsDeleting(true);

    try {
      // モックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      console.log("アカウントを削除しました");

      // ログアウト処理を実行
      logout();

      // 新規登録画面に遷移
      navigate("/register");
    } catch (error) {
      console.error("アカウントの削除に失敗しました:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  return (
    <div className="delete-account">
      <div className="container">
        <div className="edit-form">
          <div className="form-header">
            <h2 className="form-title">Meetolioを退会</h2>
            <p className="form-description">
              アカウントを削除すると、すべてのデータが完全に削除され、復元することはできません。
              この操作は取り消すことができません。
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 退会理由 */}
            <div className="form-group">
              <label htmlFor="reason">退会理由</label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="退会理由をお聞かせください"
                rows={5}
                className={errors.reason ? "error" : ""}
              />
              {errors.reason && (
                <div className="error-message">{errors.reason}</div>
              )}
            </div>

            {/* パスワード確認 */}
            <div className="form-group">
              <label htmlFor="password">パスワード確認</label>
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

            {/* 退会前の確認事項 */}
            <div className="form-group">
              <label>退会する前に</label>
              <div className="warning-section">
                <ul className="warning-list">
                  <li>
                    アカウントを削除すると、すべてのデータが完全に削除されます。
                  </li>
                  <li>削除されたデータは復元できません。</li>
                  <li>この操作は取り消すことができません。</li>
                  <li>退会後は同じメールアドレスでの再登録が可能です。</li>
                </ul>
              </div>
            </div>

            {/* ボタン */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? "削除中..." : "アカウントを削除する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
