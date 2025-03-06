# 開発環境用 Dockerfile
FROM node:20-alpine AS development

WORKDIR /app

# システム依存関係のインストール
RUN apk add --no-cache \
    git \
    python3 \
    make \
    gcc \
    g++

# パッケージのコピーとインストール
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# アプリケーションコードのコピー
COPY . .

# 開発サーバーの起動
CMD ["yarn", "dev"]
