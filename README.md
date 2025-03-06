# TODO アプリケーション

## プロジェクト概要

このプロジェクトは、Vue3/Nuxt3 と Supabase を使用した最新の TODO アプリケーションです。
Docker 環境で開発され、モダンな開発プラクティスとツールを採用しています。

## 主な機能

### タスク管理

- タスクの一覧表示（ステータス別）
  - 未完了
  - 対応中
  - 完了
- タスクの追加、編集、削除
- タスクの詳細情報
  - タイトル（必須）
  - 説明
  - ステータス（必須）
  - 期限日（yyyy/MM/dd）
  - 優先度（高、中、低）
  - 作成者（必須）
  - 担当者

### ユーザー管理

- ユーザー登録
- ログイン/ログアウト
- セッション管理
- ユーザープロフィール
  - ID
  - メールアドレス
  - パスワード
  - 名前

## 技術スタック

### フロントエンド

- Vue3（Composition API）
- Nuxt3
- TypeScript
- Pinia（状態管理）
- Tailwind CSS + daisyUI

### バックエンド

- Supabase
  - PostgreSQL
  - 認証システム
  - リアルタイム機能

### 開発環境

- Docker
- Docker Compose

### テスト

- Vitest（ユニットテスト）
- Playwright（E2E テスト）

### コード品質

- ESLint
- Prettier
- TypeScript

### CI/CD

- GitHub Actions

## 開発環境のセットアップ

### 必要条件

- Docker
- Docker Compose
- Node.js 20.x 以上（ローカル開発用）
- Git

### インストール手順（予定）

1. リポジトリのクローン

```bash
git clone [repository-url]
cd todo-app
```

2. 環境変数の設定

```bash
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定
```

3. Docker コンテナの起動

```bash
docker-compose up -d
```

4. アプリケーションの起動

```bash
# フロントエンドの開発サーバー起動
docker-compose exec frontend yarn dev
```

5. ブラウザでアクセス

```
http://localhost:3000
```

## ディレクトリ構造（予定）

```
todo-app/
├── .github/            # GitHub Actions設定
├── components/         # Vueコンポーネント
├── composables/        # Vue Composables
├── layouts/           # Nuxtレイアウト
├── pages/             # ページコンポーネント
├── plugins/           # Nuxtプラグイン
├── public/            # 静的ファイル
├── stores/            # Piniaストア
├── types/             # TypeScript型定義
├── docker/            # Docker関連ファイル
├── tests/             # テストファイル
└── utils/             # ユーティリティ関数
```

## セキュリティ対策

- JWT 認証
- パスワードハッシュ化
- XSS 対策
- CSRF 対策
- Row Level Security (RLS)
- 入力バリデーション

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 作者

[Your Name]
