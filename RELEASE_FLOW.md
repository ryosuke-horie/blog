# ブログ記事リリースフロー分析

## 現状のリリースフロー

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           現状のリリースフロー                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  純正メモで   │───▶│  Markdown    │───▶│  VSCodeで    │───▶│  ファイル    │
│  記事を執筆   │    │  書き出し    │    │  ファイル作成 │    │  命名       │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  FrontMatter │───▶│  TextLint    │───▶│  ビルド確認   │───▶│  GitHub      │
│  手動記述    │    │  チェック    │    │  npm run build│    │  プッシュ    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                                   │
                    ┌──────────────────────────────────────────────┘
                    ▼
              ┌──────────────┐
              │  Cloudflare  │
              │  自動デプロイ │
              └──────────────┘
```

## 各ステップの詳細と課題

| ステップ | 作業内容 | 手間 | 課題 |
|---------|---------|------|------|
| 1. 執筆 | macOS/iOS純正メモで記事を書く | 低 | 特になし |
| 2. 書き出し | 純正メモの「Markdownとして書き出し」機能を使用 | 低 | 特になし |
| 3. ファイル作成 | VSCodeでファイルを新規作成し内容を貼り付け | 中 | ツール間の切り替えが発生 |
| 4. ファイル命名 | `YYYY-MM-DD-タイトル.md`形式で命名 | 中 | 日付の手動入力、タイトル整形 |
| 5. FrontMatter記述 | title, description, pubDate等を手動で記述 | **高** | 毎回同じ作業、フォーマット記憶が必要 |
| 6. TextLintチェック | `npm run textlint`を実行 | 低 | コマンド実行の手間 |
| 7. ビルド確認 | `npm run build`を実行 | 低 | コマンド実行の手間 |
| 8. GitHubプッシュ | git add, commit, pushを実行 | 低 | コマンド実行の手間 |
| 9. 自動デプロイ | Cloudflare Workersへ自動デプロイ | なし | 自動化済み |

## ボトルネック分析

### 最も手間がかかる作業（優先度: 高）

1. **FrontMatterの手動記述**
   - 毎回同じフォーマットを手動で書く必要がある
   - 日付のISO形式への変換が手間
   - descriptionの記述を忘れがち

2. **ファイル命名**
   - 日付（YYYY-MM-DD）の手動入力
   - タイトルの日本語/英語の判断

### ツール間の切り替え（優先度: 中）

3. **純正メモ → VSCode → ターミナル**
   - 複数アプリ間の切り替えが発生
   - 集中力が途切れる

### コマンド実行（優先度: 低）

4. **TextLint + ビルド + Git操作**
   - 複数コマンドの実行が必要
   - 忘れるとエラーの原因になる

## 理想のフロー（検討中）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           理想のリリースフロー                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  純正メモで   │───▶│  ワンクリック │───▶│  自動デプロイ │
│  記事を執筆   │    │  公開        │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

理想的には：
- 純正メモで書いたらそのまま公開できる
- FrontMatterは自動生成される
- ファイル名も自動で付与される
- TextLint/ビルド/デプロイは自動化される

## 技術的な選択肢（調査結果）

### 選択肢1: 現在のAstro構成 + 自動化スクリプト

**概要**: 現在のAstroベースの構成を維持しつつ、手作業を自動化するスクリプトを導入

| 項目 | 実現方法 | 実装難易度 |
|-----|---------|-----------|
| FrontMatter自動生成 | CLIスクリプト（タイトルから自動生成） | 低 |
| ファイル名自動付与 | CLIスクリプト（日付+タイトル） | 低 |
| TextLint/ビルド自動化 | GitHub Actionsまたはpre-commitフック | 低 |

**メリット**:
- 現在の構成をそのまま活かせる
- 段階的に導入可能
- カスタマイズが容易

**デメリット**:
- 純正メモからの連携は依然として手動
- VSCodeでの操作は必要

### 選択肢2: Apple Shortcuts連携

**概要**: iOS/macOSのショートカットアプリで純正メモからGitHubまでを自動化

```
純正メモ → Shortcuts → Markdown変換 → FrontMatter追加 → GitHubにプッシュ
```

**利用可能なツール/アクション**:
- `Make Markdown from Rich Text`: Shortcutsの標準アクション
- [apple-notes-exporter](https://github.com/Kylmakalle/apple-notes-exporter): Shortcuts.appでMarkdownエクスポート
- [stash](https://github.com/shakedlokits/stash): Apple Notes ↔ Markdown双方向同期

**メリット**:
- 純正メモからワンタップで公開可能
- iPhone/iPadからも投稿可能

**デメリット**:
- Markdown変換の精度に制限あり（テーブル、脚注等は非対応）
- Shortcutsの設定が複雑
- GitHubプッシュにはWorking Copyなど追加アプリが必要

### 選択肢3: iOS 26/macOS 26のネイティブMarkdownサポート待ち

**概要**: 2025年秋リリース予定のiOS 26/macOS 26で、純正メモのMarkdownエクスポートがネイティブサポートされる

> Apple Notes in macOS 26 can now import and export Markdown-formatted documents
> [Apple Insider](https://appleinsider.com/inside/macos-26/tips/how-to-import-export-markdown-with-apple-notes-in-macos-tahoe)

**新機能**:
- File > Export as > Markdown でエクスポート可能
- 複数ノートの一括エクスポートに対応

**制限事項**:
- 基本的なMarkdown構文のみ対応（見出し、リスト、リンク）
- テーブル、脚注、ダイアグラムは非対応

**メリット**:
- OS標準機能のため安定性が高い
- 追加ツール不要

**デメリット**:
- 2025年秋まで待つ必要がある
- FrontMatter追加は別途必要

### 選択肢4: 代替プラットフォームへの移行

#### Notion + GitHub連携
- Notion APIでコンテンツを取得→Astroにビルド
- [notion-to-md](https://github.com/souvikinator/notion-to-md)などのツールを使用

#### Obsidian + Git
- Obsidianで直接Markdown執筆
- Obsidian Gitプラグインで自動同期

#### ヘッドレスCMS
- Contentful、Sanity、microCMS等
- API経由でコンテンツ取得

**メリット**:
- 執筆からデプロイまで一元管理
- 高機能なエディタを使用可能

**デメリット**:
- 純正メモからの移行が必要
- プラットフォームへの依存

## 推奨アプローチ

### 短期（すぐに実施可能）

1. **FrontMatter自動生成CLIスクリプトの作成**
   - タイトルを入力すると、日付付きファイル名とFrontMatterを自動生成
   - 純正メモからコピペした内容を標準入力で受け取る

2. **GitHub Actionsの導入**
   - PRマージ時にTextLint + ビルドを自動実行
   - エラーがあれば通知

### 中期（iOS 26リリース後）

3. **iOS 26のネイティブMarkdownエクスポート活用**
   - 純正メモ → Markdownエクスポート → CLIスクリプトでFrontMatter追加

### 長期（必要に応じて）

4. **Shortcuts連携の構築**
   - 純正メモからワンタップ公開を実現

## 確定した要件

### FrontMatter簡略化

**現状のFrontMatter**:
```yaml
---
title: 記事タイトル
description: 記事の説明文  # ← 削除
pubDate: 2025-01-18T10:00:00.000Z
updatedDate: 2025-01-18T10:00:00.000Z  # ← 任意
heroImage: /image.png  # ← 任意（追加することが多い）
---
```

**新しいFrontMatter**:
```yaml
---
title: 記事タイトル
pubDate: 2025-01-18T10:00:00.000Z
heroImage: /image.png  # 任意
---
```

### 記事作成CLI仕様

**実行方法**:
```bash
npm run new-post
```

**動作フロー**:
```
$ npm run new-post

? 記事のタイトルを入力してください: Claude Codeの使い方

✓ 作成しました: src/content/blog/2025-01-18-Claude Codeの使い方.md
```

**仕様詳細**:

| 項目 | 仕様 |
|-----|------|
| 実装言語 | Node.js |
| 入力方式 | 対話式（プロンプトでタイトル入力） |
| ファイル名 | `YYYY-MM-DD-{タイトル}.md`（現在日付） |
| 保存先 | `src/content/blog/` |
| 同名ファイル | 上書き |
| エディタ起動 | しない |
| クリップボード | 使用しない（本文は手動で貼り付け） |

**生成されるファイル**:
```markdown
---
title: Claude Codeの使い方
pubDate: 2025-01-18T12:00:00.000Z
---

```

**ユーザーの作業**:
1. `npm run new-post` を実行
2. タイトルを入力
3. 生成されたファイルを開く
4. 純正メモからコピーした内容を貼り付け
5. 必要に応じてheroImageを追加

## 次のアクションアイテム（実装issue候補）

以下の実装issueを作成することを推奨します：

### 優先度: 高

1. **descriptionフィールドの削除**
   - `src/content.config.ts` からdescriptionを削除
   - `frontmatter.json` からdescriptionを削除
   - 既存記事のdescriptionは残しても問題なし（任意フィールド化）

2. **ブログ記事作成CLIスクリプトの実装**
   - `npm run new-post "タイトル"` で実行
   - ファイル名（YYYY-MM-DD-タイトル.md）自動生成
   - FrontMatter（title, pubDate）自動挿入
   - 実装: Node.jsスクリプト

2. **GitHub Actions CI/CDの導入**
   - PR作成時: TextLint実行、ビルドチェック
   - mainマージ時: Cloudflare Workersへの自動デプロイ
   - エラー時の通知設定

### 優先度: 中

3. **npm scriptsの拡充**
   - `npm run new-post "タイトル"` で記事作成
   - `npm run publish` でTextLint + ビルド + git操作を一括実行

### 優先度: 低（iOS 26リリース後）

4. **Apple Shortcuts連携の構築**
   - 純正メモからワンタップで記事ファイルを生成
   - Working Copy連携でGitHubにプッシュ

---

## まとめ

現状のリリースフローでは、**FrontMatterの手動記述**と**ファイル命名**がボトルネックになっています。

**短期的な改善**として、CLIスクリプトとGitHub Actionsの導入を推奨します。これにより、純正メモでの執筆体験はそのままに、公開までの手間を大幅に削減できます。

**中長期的**には、iOS 26のネイティブMarkdownサポートを活用し、さらにシームレスなフローを実現できる見込みです。

## 参考リンク

- [apple-notes-exporter](https://github.com/Kylmakalle/apple-notes-exporter) - Shortcuts.appでのエクスポート
- [stash](https://github.com/shakedlokits/stash) - Apple Notes ↔ Markdown双方向同期
- [apple-notes-liberator](https://github.com/HamburgChimps/apple-notes-liberator) - Apple Notesデータの解放
- [iOS 26 Markdown機能](https://www.macrumors.com/how-to/ios-import-export-markdown-apple-notes/) - MacRumors記事
