-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL
);

-- ポートフォリオテーブル
CREATE TABLE IF NOT EXISTS portfolios (
    user_id INT PRIMARY KEY REFERENCES users(id),
    name VARCHAR(255),
    name_kana VARCHAR(255),
    company VARCHAR(255),
    occupation VARCHAR(255),
    description TEXT,
    name_card_img_url VARCHAR(500),
    email VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    website VARCHAR(500),
    created_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP default CURRENT_TIMESTAMP NOT NULL
);