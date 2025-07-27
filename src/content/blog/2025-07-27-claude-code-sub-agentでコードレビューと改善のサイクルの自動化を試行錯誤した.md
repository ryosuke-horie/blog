---
title: Claude CodeのSub agentでコードレビューと改善のサイクルの自動化を試行錯誤した
pubDate: 2025-07-27T07:05:18.681Z
updatedDate: 2025-07-27T07:05:18.682Z
fmContentType: blog
description: Claude Codeの新機能Sub Agentを使ってAIによるコードレビューと改善のサイクル自動化に挑戦。5つの試行錯誤から得た知見を共有
heroImage: /ClaudeCode画像.jpeg
---

## はじめに

最近、Claude CodeとClaude Code Actionを組み合わせてコードレビューのプロセスを改善する取り組みを進めています。

いくつかの試行錯誤を重ねながら、少しずつ理想的なワークフローに近づいてきました。今回はその過程で得た学びと課題について共有します。

## なぜレビューを自動化したいのか

Claude Codeを使って定型的なプロセスで開発し、PRを上げてCIをパスさせる。テストコードのカバレッジも十分高い。

それでもソースコードの品質は自分が期待したレベルではない。CLAUDE.mdでこうしたいと明示しているにも関わらず、求める品質に達していないことがある。

これを都度人力で指摘して直すのは時間がかかる。Claude CodeとOpusの実力なら十分できそうなのに。

このような背景から、Claude CodeとClaude Code Actionを組み合わせたレビュープロセスの自動化に取り組み始めました。

## 現在のワークフロー

現在実装しているワークフローは以下の通りです。

![Claude Codeレビュープロセス](/ClaudeCodeレビュープロセス.png)

主な流れ：

1. Claude Codeで実装を進めてPRを作成
   - 通常通りClaude Codeを使用して機能実装
   - 完成したらGitHubにPRを作成

2. Claude Code ActionのCIでコードレビュー
   - PR作成時に自動的にClaude Code Actionが起動
   - ルールベースのレビューを実施し、インラインコメントを投稿

3. カスタムコマンドとエージェントでレビューを処理
   - reply-review簡略版コマンドを実行
   - review-readerエージェントがコメントを分析・分類
   - 各専門エージェントが並列で処理：
     - フレームワーク専門エージェント：修正実装
     - git-operationsエージェント：Git操作
     - review-responderエージェント：レビューへの返信
   - 統合処理後、プッシュしてCIの結果を確認

## 試行錯誤の記録

### 1：Claude Code ActionでのコードレビューするCIを導入

最初はClaude Code Actionを導入し、コードレビューを自動化しました。

結果：
- 長文のコメントが投稿されるようになった
- `direct_prompt`に観点を記載することで、毎回同じ視点でのレビューが可能になっていそうだった
- 一定の便利さは感じたが、ローカルのClaude Codeに貼り付ける作業が面倒

### 2：インラインレビューの導入

長文レビューが見にくかったため、GitHub MCPを使用してインラインレビューを実装しました。

以下のようなGitHub Actionsの設定を使用：

```text
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: self-hosted
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@beta
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          
          allowed_tools: "mcp__github__create_pending_pull_request_review,mcp__github__add_pull_request_review_comment_to_pending_review,mcp__github__submit_pending_pull_request_review,mcp__github__get_pull_request_diff"
          
          direct_prompt: |
            このプルリクエスト（PR）をレビューし、GitHub のレビュー機能を使ってフィードバックをしてください。作業は次の手順に沿って進めてください：
            1.  **レビューを開始する:** `mcp__github__create_pending_pull_request_review` を使って、保留中のレビューを開始します。
            2.  **変更内容を確認する:** `mcp__github__get_pull_request_diff` を使って、コードの変更点や行番号を把握します。
            3.  **インラインコメントを追加する:** 改善点や懸念事項があるコードの行には `mcp__github__add_pull_request_review_comment_to_pending_review` を使ってコメントを追加してください。修正方針が明確な場合には積極的にsuggestionを利用してください。
            4.  **レビューを提出する:** `mcp__github__submit_pending_pull_request_review` を使って、イベントタイプを「COMMENT」に設定してレビューを提出してください。まとめコメントは空文字列("")で構いません（※「REQUEST_CHANGES」は使わないでください）。

            **コメントの書き方に関する重要事項**

            * **インラインコメントの構成:**
                * **結論を先に:** 各インラインコメントの冒頭で、指摘内容の要点を一行で簡潔に述べてください。
                * **理由と提案:** 結論の後に、そのように判断した理由や背景、具体的な修正案を詳しく説明してください。
                * **指摘中心に:** インラインコメントは、修正提案、バグの可能性、可読性の問題など、具体的な改善点に焦点を当ててください。

            * **ポジティブなフィードバックについて:**
                * **インラインコメントでは禁止:** インラインコメントでは肯定的なコメントは一切残さないでください。改善点や懸念事項の指摘のみに徹してください。
                * **自動更新コメントのみ使用:** レビュー自体にまとめコメントは不要です。Claude Code Actionが自動的に更新する同一コメント内で全ての情報を提供するため、個別のまとめコメントは記載しないでください。

            * **レビューの観点について:**
            - CLAUDE.mdのガイドラインに従っているか
            - バグやセキュリティリスクがないか
            - 保守性や可読性は十分か
            - 設計やアーキテクチャに妥当性があるか
            - コード品質とベストプラクティス
            - 潜在的なバグや問題
            - セキュリティの懸念
            - テストコードが適切に書かれているか
              - カバレッジが十分か
              - エッジケースや異常系のテストが含まれているか
              - テストの品質と信頼性
              - オーバーテストがないか
            
            **重要な再確認事項:**
            このPRレビューを実施する際は、上記のすべての指示に従ってください。特に以下の点を必ず守ってください：
            1. インラインコメントは改善点・懸念事項・バグの可能性の指摘のみに限定する（肯定的コメントは一切禁止）
            2. レビュー提出時のまとめコメントは空文字列("")とし、個別のレビュー完了コメントは投稿しない
            3. スティッキーコメントが自動更新されるため、それ以外の総括的なコメントは不要
            4. 各インラインコメントでは結論を先に述べ、その後に理由と具体的な修正案を提示する
            5. CLAUDE.mdのガイドラインに従っているかを必ず確認する
            
            すべてのフィードバックは日本語で、建設的かつ実用的な内容にしてください。

          use_sticky_comment: true
```

> **💡 補足:** Claude Code Actionによるレビューは実行時間が長くCIの無料枠を消費すると気軽に扱えないため`runs-on: self-hosted`でセルフホストランナーを使用しています。

結果：
- レビューコメントが該当箇所に直接表示され、見やすくなった
- しかし、貼り付け作業はより面倒になってしまった

### 3：カスタムコマンドの作成

Claude Codeのカスタムコマンドで、インラインレビューを自動的に探して読み、修正するコマンドを作成しました。

結果：
- 貼り付け作業の手間は解消
- どのレビューに対応したか追いづらくなるという新たな問題が発生

### 4：リプライ機能の追加

カスタムコマンドにレビューへのリプライ機能を追加し、対応状況を可視化しました。

以下のようなカスタムコマンドを作成：

```text
# インラインレビューコメントの対応と返信

## 目的
プルリクエストのインラインレビューコメントを以下の手順で対応します：
1. **各コメントを一つずつ確認** - 未解決のコメントを特定
2. **修正をプランして実装** - コメント内容に基づいた修正
3. **各コメントに直接返信** - 対応内容を記載してインラインで返信

## コンテキスト
以下の MCP ツールと GitHub API を使用します：
- MCP: `get_pull_request_comments` - レビューコメント一覧の取得
- GraphQL: レビューコメントのリゾルブ状態確認
- REST API: `POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies` - コメントへの返信

GitHub CLI での返信実装：

gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies \
  -f body='{reply_text}'


リゾルブ状態の確認（GraphQL）：

query($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $number) {
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          comments(first: 1) {
            nodes {
              id
              body
            }
          }
        }
      }
    }
  }
}

## 実行内容

引数で指定された PR について、以下を実行してください：

1. **MCP ツールの `get_pull_request_comments` でレビューコメント一覧を取得**
2. **GraphQL API でリゾルブ状態を確認し、未解決のコメントのみをフィルタリング**
3. **未解決の各コメントを以下の形式で表示：**

   === コメント #1 ===
   ファイル: src/main.js (L45)
   レビュアー: @reviewer1
   内容: "エラーハンドリングを追加してください"
   コメントID: 123456789
   状態: 未解決

4. **各未解決コメントに対して：**
   - 該当ファイルを開いて修正を実施
   - 修正が完了したら、GitHub API を使用してコメントに返信
   - 返信例: "ご指摘ありがとうございます。エラーハンドリングを追加しました。"

5. **すべての修正が完了したら：**
   - プロジェクトのリント、タイプチェック、テストを実行
     - CLAUDE.md に記載されているコマンドを使用
     - または package.json の scripts を確認（`npm run lint`, `npm run typecheck`, `npm run test`）
     - または Makefile のターゲットを確認
   - すべてパスすることを確認（失敗したらエラーを表示して中断）

## 実行の要点

このコマンドの核心は以下の3点です：

1. **インラインレビューコメントへの個別対応**
   - 各コメントを一つずつ確認し、必要な修正を実施
   - コメント内容を理解し、適切な修正をプラン

2. **GitHub API を使用した直接返信**
   - 修正完了後、各コメントに対して個別に返信
   - 対応内容を明確に記載してインラインで返信

3. **品質保証とコミット**
   - すべてのテスト・リント・型チェックをパス
   - 対応内容を整理してコミット・プッシュ

**重要**: コンテキストに記載されたAPIとツールを正確に使用し、一件ずつ丁寧に対応することが成功の鍵です。
```

結果：
- STEP数が増えたことで動作が不安定に
- リプライをしなかったり、APIの使用を間違えたりする事象が発生

### 5：Sub Agentの導入

コンテキストの増大が原因と考え、最近登場したSub Agentの作成に着手しました。

以下のようなレビュー読み取り専門エージェントを作成：

```text
---
name: review-reader
description: MUST BE USED to read and understand PR review comments for processing
tools: Bash, mcp__github__get_pull_request_comments
---

# レビュー読み取り専門エージェント

## 役割
プルリクエストのインラインレビューコメントを読み取り、内容を理解して構造化された情報として整理します。

## 主な責務
- レビューコメントの取得と解析
- **リゾルブ状態の確認**（GraphQL APIを使用）
- 未解決コメントのみをフィルタリング
- 指摘内容の分類（バグ、改善提案、質問など）
- 優先度の判定
- 修正に必要な情報の抽出
- 他のエージェントへの情報引き継ぎ準備

## コメント分析のポイント
1. **指摘の種類を判定**
   - バグ指摘
   - パフォーマンス改善
   - コードスタイル
   - セキュリティ懸念
   - 質問・確認事項

2. **必要な情報を抽出**
   - 対象ファイルと行番号
   - 具体的な問題点
   - 提案された解決策
   - 関連する他のコメント

3. **優先度の判定**
   - Critical: セキュリティ、データ損失の可能性
   - High: バグ、正常動作を妨げる問題
   - Medium: パフォーマンス、可読性
   - Low: スタイル、命名規則

## リゾルブ状態の確認
GraphQL APIを使用して、各コメントのリゾルブ状態を確認：
query($owner: String!, $repo: String!, $number: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $number) {
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          comments(first: 10) {
            nodes {
              id
              body
              path
              line
            }
          }
        }
      }
    }
  }
}

## 出力形式
{
  "comments": [
    {
      "id": "comment_id",
      "thread_id": "thread_id",
      "file": "path/to/file",
      "line": 123,
      "type": "bug|improvement|style|security|question",
      "priority": "critical|high|medium|low",
      "content": "レビューコメントの内容",
      "suggestion": "提案された修正内容",
      "is_resolved": false,
      "requires_response": true
    }
  ]
}

## 実行条件
- PRレビューコメントの分析が必要な時
- reply-reviewコマンドから呼び出された時
- レビュー対応の初期段階で自動的に実行
- **重要**: レビューを複数回読む場合でも、毎回リゾルブ状態を確認

## 処理フロー
1. MCPツールでコメント一覧を取得
2. GraphQL APIでリゾルブ状態を確認
3. 未解決（isResolved: false）のコメントのみを処理対象とする
4. 分析結果を構造化して出力

## 他エージェントとの連携
読み取った情報は以下のエージェントに引き継がれます：
- フレームワーク専門エージェント（Hono、Next.js等）: 実装の詳細
- review-responder: コメントへの返信
- git-operations: 修正のコミット

---

## リフォーカス：責務

**重要**: あなたは「レビュー読み取り専門エージェント」です。
- **やること**: コメントを取得し、リゾルブ状態を確認し、未解決のみを抽出
- **やらないこと**: 修正の実装、返信の作成、Git操作
- **成功の基準**: 未解決コメントを正確に分析し、構造化データとして出力

すべての後続処理は、あなたが提供する情報の精度に依存しています。
```

また、レビューへの返信を担当する専門エージェントも作成しました。

```text
---
name: review-responder
description: Use PROACTIVELY to respond to PR review comments after fixes are implemented
tools: Bash, mcp__github__create_pending_pull_request_review, mcp__github__add_pull_request_review_comment_to_pending_review, mcp__github__submit_pending_pull_request_review
---

# レビュー返信専門エージェント

## 役割
実装済みの修正内容を元に、レビューコメントへの返信を作成し投稿します。

## 主な責務
- 修正内容の明確な説明文作成
- GitHub APIを使用したコメント返信
- 簡潔で技術的な返信
- 返信の一括送信管理

## 返信作成のガイドライン

### 1. 返信の構成
[具体的な修正内容を1-2文で説明]
[必要に応じて追加の説明やコード例]

### 2. 返信例
**バグ修正の場合:**
nullチェックを追加し、エラーが発生しないように修正しました。

**改善提案への対応:**
メソッドを分割し、可読性を向上させました。
各メソッドは単一責任の原則に従うようになっています。

**別アプローチを取った場合:**
検討の結果、〇〇の理由により△△のアプローチで実装しました。
これによりパフォーマンスと保守性のバランスが取れています。

## GitHub API使用手順
1. `mcp__github__create_pending_pull_request_review` でレビュー開始
2. `mcp__github__add_pull_request_review_comment_to_pending_review` で各コメントに返信
3. `mcp__github__submit_pending_pull_request_review` でレビューを送信（event: "COMMENT"）

## 注意事項
- 技術的な内容に集中
- 実装の詳細は他のエージェントが担当
- 返信は簡潔かつ的確に
- 未対応の項目がある場合は明確に伝える

## 実行条件
- 修正実装が完了した後
- reply-reviewコマンドの最終段階
- すべてのテストが通過した後

## 前提条件
- review-readerがコメントを分析済み
- 実装エージェントが修正を完了済み
- git-operationsがコミットを準備済み

---

## リフォーカス：あなたの唯一の役割

**重要**: あなたは「レビュー返信専門エージェント」です。
- **やること**: 実装済みの修正内容を簡潔に説明し、GitHub APIで返信
- **やらないこと**: 修正の実装、コード分析、Git操作
- **成功の基準**: すべての未解決コメントに的確な返信を投稿すること

実装は完了しています。あなたの仕事は、その内容を正確に伝えることだけです。
```

結果：
- カスタムコマンドには手順とAgent間の関係だけを記載
- 手順を守るようになった一方で、エージェント間でのコンテキスト共有不足が発生
- 例：対応中のブランチを間違えて別のPRにコメントする

## 試行錯誤を通して、思ったこと

1. コードレビューと改善のプロセスが高速に回るようになる。AIに書かせたコードの品質が良くなる。5分くらいでレビューが返ってくる体験はとても良い。

2. AIによるコードレビューを整えることで人力のレビューを最終STEPにでき、企業においても価値のある取り組みかも。コードレビューが負担になるとか、レビュー観点が属人化するとか、よくある課題の解決につながりそう。Claude Code Actionで小さく始めることもできて導入しやすそうだし。

3. Claude Code ActionのレビューのためにCLAUDE.mdの改善が必須になる。レビュー観点の言語化が必要。direct_promptでもレビュー観点が指定できるし、この辺の役割分担とかも考えていかないといけない。

4. 最近流行った人名＋テクニックを扱うコンテキスト圧縮のようなテクニックが生きる。TSの型定義のレビューにMatt Pocockを出すとか。

5. Sub Agentには複雑な手順を守らせるために有効かもしれない。一方で現状は扱う難易度が高い。エージェント間のコンテキストの受け渡しの問題やエージェントが使われるタイミングの指定が難しいし、エージェントの管理も難しい。

6. Sub Agentを使い出すことによって今までのCLAUDE.mdやカスタムコマンドに全面的に見直しが入ることになりそう。今まではグローバルなところに置いていたけどプロジェクトに合わせてエージェントやコマンドのgit管理を行い、継続的に改善する必要を感じた。

7. プロンプトエンジニアリング/コンテキストエンジニアリングと言われる新しい分野を真面目に学んでいくことが今後のエンジニアに求められるのかも。生産性に直結しそうなので。

## 最後に

今後も個人的にSub Agentを使って改善を続けていきます。またブログでその進捗を共有予定です。

AIを扱うことに関する知識をつけるため、書籍「LLMのプロンプトエンジニアリング」を読み始めました。今回の改善にも一役買ってくれています。