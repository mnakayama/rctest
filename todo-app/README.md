# TODOリスト管理アプリケーション

詳細なTODOリスト管理システムです。ユーザー認証、TODOの作成・編集・削除、優先度設定、期限設定、カテゴリ分け、タグ付けなどの機能を備えています。

## 技術スタック

- **フロントエンド**
  - Vue3 (Composition API)
  - Nuxt.js 3
  - TypeScript
  - Pinia (状態管理)
  - Tailwind CSS + daisyUI (UIフレームワーク)

- **バックエンド**
  - PostgreSQL
  - Nuxt Server API

- **開発環境**
  - Docker / Docker Compose
  - ESLint / Prettier
  - Vitest (テスト)

## 機能

- **ユーザー認証**
  - 新規ユーザー登録（メールアドレス検証付き）
  - ログイン/ログアウト
  - パスワードリセット

- **TODO管理**
  - TODO項目の作成、閲覧、編集、削除
  - 優先度設定（高/中/低）
  - 期限日時の設定
  - 完了/未完了ステータス管理
  - カテゴリ/タグ付け

- **フィルタリング/検索**
  - テキスト検索
  - カテゴリ、優先度、ステータスによるフィルタリング

## セットアップ手順

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js 18以上がインストールされていること（ローカル開発用）

### 環境変数の設定

必要な環境変数は既に`.env`ファイルに設定されています。必要に応じて変更してください：

```
# アプリケーション設定
NUXT_PUBLIC_APP_NAME=TODO List Manager
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_HOST=0.0.0.0
NUXT_PORT=3000
NODE_ENV=development

# PostgreSQL設定
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=postgres

# セキュリティ設定
NUXT_CSRF_SECRET=your-csrf-secret-key-change-me
```

### Dockerを使用した開発環境のセットアップ

1. Docker Composeでアプリケーションを起動します：

```bash
docker-compose up -d
```

2. アプリケーションは http://localhost:3000 でアクセスできます。

### ローカル開発環境のセットアップ（Docker不使用）

1. 依存関係をインストールします：

```bash
yarn install
```

2. 開発サーバーを起動します：

```bash
yarn dev
```

3. アプリケーションは http://localhost:3000 でアクセスできます。

## プロジェクト構造

```
todo-app/
├── components/         # Vueコンポーネント
│   ├── auth/           # 認証関連コンポーネント
│   └── todo/           # TODO関連コンポーネント
├── layouts/            # レイアウトコンポーネント
├── middleware/         # Nuxtミドルウェア
├── pages/              # ページコンポーネント
├── public/             # 静的ファイル
├── server/             # サーバーサイドAPI
│   └── api/            # APIエンドポイント
├── stores/             # Piniaストア
├── supabase/           # データベース関連ファイル
│   └── init/           # データベース初期化スクリプト
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── .env                # 環境変数
├── .env.example        # 環境変数テンプレート
├── docker-compose.yml  # Docker Compose設定
├── Dockerfile          # Dockerファイル
└── nuxt.config.ts      # Nuxt設定
```

## デプロイ

### 本番環境へのデプロイ

1. 本番用のDockerイメージをビルドします：

```bash
docker build --target production -t todo-app:prod .
```

2. 本番環境で実行します：

```bash
docker run -p 3000:3000 --env-file .env.production todo-app:prod
```

## ライセンス

MIT
