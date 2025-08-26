# Meetolio

## 画面モックの起動手順

**1. リポジトリの取得**

リポジトリをクローン、または最新を取得する。

**2. mock フォルダに移動**

```bash
cd mock
```

**3. コンテナの起動**

コンテナをバックグラウンドで起動する。

```bash
docker-compose up -d
```

ブラウザで localhost:3000 を開く

```bash
localhost:3000
```

**4. コンテナの停止**

作業が終わったら、コンテナを停止する。

```bash
docker-compose down
```
