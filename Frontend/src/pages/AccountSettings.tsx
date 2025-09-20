import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "./AccountSettings.css";

const AccountSettings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // 認証チェックと権限確認
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // URLのuserIdとログインユーザーのIDが一致するかチェック
    if (userId !== user?.id) {
      // 権限がない場合は自分の設定ページにリダイレクト
      navigate(`/settings/${user?.id}`);
      return;
    }
  }, [isAuthenticated, user, navigate, userId]);

  if (!user || !isAuthenticated || userId !== user.id) {
    return null;
  }

  return (
    <div className="settings">
      <div className="container">
        <div className="settings-content">
          <div className="settings-main">
            <div className="settings-section">
              <h2 className="settings-title">アカウント設定</h2>

              {/* メールアドレス変更 */}
              <div
                className="account-item clickable"
                onClick={() => navigate(`/settings/${userId}/email`)}
              >
                <div className="account-item-content">
                  <div className="account-item-label">メールアドレス</div>
                  <div className="account-item-value">{user.email}</div>
                </div>
                <div className="account-change-hint">変更 &gt;</div>
              </div>

              {/* パスワード変更 */}
              <div
                className="account-item clickable"
                onClick={() => navigate(`/settings/${userId}/password`)}
              >
                <div className="account-item-content">
                  <div className="account-item-label">パスワード</div>
                  <div className="account-item-value">********</div>
                </div>
                <div className="account-change-hint">変更 &gt;</div>
              </div>

              {/* 退会処理 */}
              <div
                className="account-item clickable"
                onClick={() => navigate(`/settings/${userId}/delete`)}
              >
                <div className="account-item-content">
                  <div className="account-item-label">退会処理</div>
                  <div className="account-item-value">アカウントを削除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
