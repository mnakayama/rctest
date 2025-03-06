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

# 必要なファイルのコピー
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# パッケージのインストール
RUN yarn install

# Prismaクライアントの生成
RUN npx prisma generate

# アプリケーションコードのコピー
COPY . .

# Nuxtの準備
RUN yarn nuxt prepare

# 開発サーバーの起動
CMD ["yarn", "dev"]

# 本番環境用ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN yarn build

# 本番環境用実行ステージ
FROM node:20-alpine AS production

WORKDIR /app

# 本番環境用の依存関係のみをインストール
COPY package.json ./
# yarn.lockが存在する場合はコピー
COPY yarn.lock* ./
RUN yarn install --production

# ビルド済みアプリケーションをコピー
COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public

# アプリケーションの起動
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
