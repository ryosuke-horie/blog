---
title: AWS CodeDeployのafter installイベントが終わらない
pubDate: 2023-12-12
description: 'Laravel + Vue.js(Inertia.js SSR)アプリケーションのCodeDeployデプロイメント問題と解決方法。'
---

Laravel と Vue.js を使用した Inertia.js SSR アプリケーションの AWS CodeDeploy デプロイメント問題について説明します。

## 問題

appspec.yml の after install イベントで `php artisan inertia:start-ssr` を実行していたところ、デプロイメントが終わらなくなりました。

このコマンドは継続的に実行されるタイプのもので、CodeDeploy がコマンド終了を待ち続けます。

## 誤った解決策

単純にアンパサンドを使用する方法は不適切です。この場合、デフォルトの1時間のタイムアウト期間まで保留状態のままになり、タイムアウト後にデプロイが失敗します。

## 正しい解決策

以下のコマンドを使用してください。

```bash
php artisan inertia:start-ssr > /dev/null 2> /dev/null < /dev/null &
```

標準出力、標準エラー、標準入力を `/dev/null` にリダイレクトしながらバックグラウンドで実行することで、CodeDeploy がプロセス完了を待たずに次に進めるようになります。
