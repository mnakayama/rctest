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
COPY package*.json ./
RUN npm install

# アプリケーションコードのコピー
COPY . .

# 開発サーバーの起動
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
