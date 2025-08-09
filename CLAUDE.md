# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astroベースの個人技術ブログサイト。MarkdownでブログコンテンツをVSCodeで管理し、Cloudflare Workersにデプロイして公開している。

## 重要な注意事項

- **デプロイ先**: Cloudflare Workers（Pagesではない）
- **ブログコンテンツの配置**: `src/content/blog/` ディレクトリ以下
- **ブログファイル名規則**: `YYYY-MM-DD-タイトル.md` 形式
- **Front Matter CMS設定**: `frontmatter.json` で管理

## 開発コマンド

```bash
# 開発サーバー起動（http://localhost:4321）
npm run dev

# ビルド（型チェック付き）
npm run build

# ビルド結果のプレビュー
npm run preview

# TextLintによる日本語文章チェック
npm run textlint

# TextLintによる自動修正
npm run textlint:fix
```

## アーキテクチャ構成

### コンテンツ管理
- **ブログ記事**: `src/content/blog/*.md` - Front Matterで管理されたMarkdownファイル
- **必須Front Matter項目**:
  - `title`: 記事タイトル
  - `description`: 記事の説明文
  - `pubDate`: 公開日（日付型）
  - `updatedDate`: 更新日（オプション）
  - `heroImage`: ヒーロー画像パス（オプション、`/public/`からの相対パス）

### ページ構成
- `src/pages/index.astro`: トップページ（ブログ記事一覧、3列グリッドレイアウト）
- `src/pages/[...slug].astro`: 個別記事ページ（動的ルーティング）
- `src/layouts/BlogPost.astro`: ブログ記事のレイアウトテンプレート

### スタイル設定
- グローバルスタイル: `src/styles/global.css`
- レスポンシブ対応: 720px以下でモバイル表示（1列レイアウト）
- ブログ記事内画像: 最大幅80%、中央揃え

### TextLint設定
`textlint` コマンドは日本語の技術ブログ向けに設定済み:
- `preset-japanese`: 日本語の基本的な校正
- `preset-ja-technical-writing`: 技術文書向けの日本語校正
- `@textlint-ja/preset-ai-writing`: AI生成文章の改善
- 技術用語（TypeScript、GitHub等）は除外設定済み

### デプロイ設定
- **Cloudflare Workers**: `wrangler.jsonc` で設定
- **ビルド成果物**: `./dist/` ディレクトリ
- **サイトURL**: https://blog.ryosuke-horie37.workers.dev

## ブログ記事の追加方法

1. `src/content/blog/` に `YYYY-MM-DD-タイトル.md` 形式でファイル作成
2. Front Matterを記述（title、description、pubDateは必須）
3. `npm run textlint` で文章チェック
4. `npm run build` でビルド確認
5. GitHubにプッシュすると自動デプロイ

## 画像の扱い

- 画像ファイルは `/public/` ディレクトリに配置
- Markdownからは `/画像名.png` のように参照（publicは省略）
- ブログ記事内の画像は自動的に最大幅80%、中央揃えで表示