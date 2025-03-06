# TODO アプリケーション

## プロジェクト概要

このプロジェクトは TODO アプリケーションです。
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

## 画面

- ログイン画面
- ユーザー登録画面
- タスク一覧表示画面
  - モーダルで表示
- タスク登録・詳細表示・編集画面
  - モーダルで表示

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

### CI/CD

- GitHub Actions

## 開発環境のセットアップ

### 必要条件

- Docker
- Docker Compose
- Git

## ディレクトリ構造（予定）

```
[root-dir]/
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
- 入力バリデーション

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

## 作者
