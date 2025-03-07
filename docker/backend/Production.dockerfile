FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストールに必要なファイルをコピー
COPY package*.json ./

# 本番依存関係のみをインストール
RUN npm ci --only=production

# アプリケーションのソースコードをコピー
COPY . .

# TypeScriptをビルド
RUN npm run build

# 本番環境用のイメージ
FROM node:18-alpine

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 本番依存関係のみをインストール
RUN npm ci --only=production

# ビルド済みのアプリケーションをコピー
COPY --from=builder /app/dist ./dist

# 本番サーバーのポートを公開
EXPOSE 4000

# 本番サーバーを起動
CMD ["node", "dist/index.js"]
