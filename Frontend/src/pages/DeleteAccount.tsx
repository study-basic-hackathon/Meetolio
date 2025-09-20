// src/pages/DeleteAccount.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./DeleteAccount.css";

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !confirm("本当にアカウントを削除しますか？この操作は取り消せません。")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token") ?? "";
      const res = await fetch("/api/account/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // セッション切れなど
        alert("ログインが無効です。再度ログインしてください。");
        console.log("token:", token);
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("削除に失敗しました");

      // ローカル状態クリア
      logout();
      alert("アカウントを削除しました。ご利用ありがとうございました。");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("アカウント削除に失敗しました");
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
              アカウントを削除すると、すべてのデータが完全に削除され、復元できません。
              この操作は取り消せません。
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 入力欄なし（確認のみ） */}
            <div className="form-group">
              <label>退会する前に</label>
              <div className="warning-section">
                <ul className="warning-list">
                  <li>削除されたデータは復元できません。</li>
                  <li>退会後は同じメールアドレスでの再登録が可能です。</li>
                </ul>
              </div>
            </div>

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
