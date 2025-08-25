import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { RegisterForm } from "../types";
import "./Auth.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    company: "",
    jobTitle: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/mypage");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setErrors({ general: error });
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "パスワードは英数字を含む必要があります";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "パスワード確認を入力してください";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    if (!formData.name) {
      newErrors.name = "氏名を入力してください";
    } else if (formData.name.length > 50) {
      newErrors.name = "氏名は50文字以内で入力してください";
    }

    if (formData.company && formData.company.length > 100) {
      newErrors.company = "会社名は100文字以内で入力してください";
    }

    if (formData.jobTitle && formData.jobTitle.length > 100) {
      newErrors.jobTitle = "職種・役職は100文字以内で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
    } catch (error) {
      // エラーハンドリングはAuthContextで行われる
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>新規登録</h1>
            <p>Meetolioで新しいアカウントを作成しましょう</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                メールアドレス <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                パスワード <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="8文字以上、英数字を含む"
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                パスワード確認 <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
                placeholder="パスワードを再入力"
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                氏名 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="山田太郎"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="company" className="form-label">
                会社名・組織名
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`form-input ${errors.company ? "error" : ""}`}
                placeholder="株式会社サンプル"
              />
              {errors.company && (
                <span className="error-text">{errors.company}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle" className="form-label">
                職種・役職
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className={`form-input ${errors.jobTitle ? "error" : ""}`}
                placeholder="エンジニア"
              />
              {errors.jobTitle && (
                <span className="error-text">{errors.jobTitle}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "登録中..." : "アカウント作成"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              既にアカウントをお持ちの方は
              <Link to="/login" className="auth-link">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
