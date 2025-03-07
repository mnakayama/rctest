FROM node:18-alpine

WORKDIR /app

# 依存関係のインストールに必要なファイルをコピー
COPY package*.json ./

# 開発依存関係を含むすべての依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーのポートを公開
EXPOSE 4000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
