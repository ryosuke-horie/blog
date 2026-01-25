---
title: AWS CI/CD CodeDeployの実行時間の改善
pubDate: 2023-12-11
description: 'AWS CodePipeline/CodeDeployを使用したLaravel+Vueアプリケーションのデプロイメント最適化。'
---

AWS CodePipeline、CodeCommit、CodeBuild、CodeDeployを使用したLaravelとVueのモノリシックアプリケーションのEC2へのデプロイメント最適化について記述します。

## BlockTrafficの遅延問題

ターゲットグループのヘルスチェック設定が原因でした。

### 解決策

- タイムアウトと間隔を最小値に調整
- ALBの接続ドレイニング値を300秒から30秒に変更

これにより、問題を5分以上から約30秒に短縮しました。

## Install/AfterInstallの処理時間

CodeBuildで生成された`node_modules`と`vendor`ディレクトリのコピー処理が時間を消費していました。

appspec.ymlの設定を更新してファイルの上書きを試みたところ、既存ファイルとの競合エラーが発生しました。

### 解決策

before_installフェーズで既存の`vendor`と`node_modules`を削除するシェルスクリプトの実行を追加しました。
