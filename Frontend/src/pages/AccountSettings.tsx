import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "./AccountSettings.css";

const AccountSettings: React.FC = () => {
  const { user, isAuthenticated, isAuthReady } = useAuth();
  const navigate = useNavigate();

  // 認証チェック
  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isAuthReady, navigate]);

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <div className="settings">
      <div className="container">
        <div className="settings-content">
          <div className="settings-main">
            <div className="settings-section">
              <h2 className="settings-title">アカウント設定</h2>

              {/* QRコード確認 */}
              <div
                className="account-item clickable"
                onClick={() => navigate("/settings/qrcode")}
              >
                <div className="account-item-content">
                  <div className="account-item-label">QRコード</div>
                  <div className="account-item-value">あなたのQRコードです</div>
                </div>
                <div className="account-change-hint">確認 &gt;</div>
              </div>

              {/* メールアドレス変更 */}
              <div
                className="account-item clickable"
                onClick={() => navigate("/settings/email")}
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
                onClick={() => navigate("/settings/password")}
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
                onClick={() => navigate("/settings/delete")}
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
