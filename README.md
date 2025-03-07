# TODOアプリケーション

## プロジェクト概要

このプロジェクトは、Vue3/Nuxt3を使用したモダンなTODOアプリケーションです。
Docker環境で開発され、モダンな開発プラクティスとツールを採用しています。

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

- Nuxt3
- TypeScript
- Pinia
- Tailwind CSS + daisyUI

### バックエンド（API）

- Node.js
- TypeScript

### データベース

- MySQL

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

## 開発環境のセットアップ

### 必要条件

- Docker
- Docker Compose
- Git

### セットアップ手順

1. リポジトリをクローン
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Docker Composeでアプリケーションを起動
   ```bash
   docker-compose up -d
   ```

3. ブラウザでアクセス
   ```
   http://localhost:3000
   ```

## ディレクトリ構造

```
[root-dir]/
├── components/         # Vueコンポーネント
├── composables/        # Vue Composables
├── layouts/            # Nuxtレイアウト
├── middleware/         # Nuxtミドルウェア
├── pages/              # ページコンポーネント
├── public/             # 静的ファイル
├── stores/             # Piniaストア
├── types/              # TypeScript型定義
├── docker/             # Docker関連ファイル
├── tests/              # テストファイル
└── utils/              # ユーティリティ関数
```

## セキュリティ対策

- JWT 認証
- パスワードハッシュ化
- XSS 対策
- CSRF 対策
- 入力バリデーション
