## tech-blog-v3

## プロジェクトについて

VScodeでmarkdownを使って管理できる個人用ブログサイト

## 開発環境構築

```
git clone git@github.com:ryosuke-horie/tech-blog-v3.git
cd tech-blog-v3
npm install
```

## 使用技術一覧

- Astro
- Front Matter CMS
- Cloudflare Pages

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run new-post`        | Create a new blog post                           |
| `npm run textlint`        | Check Japanese text with TextLint                |

## 記事の作成方法

```bash
npm run new-post
```

1. タイトルを入力
2. heroImage（アイキャッチ画像）を番号で選択（空エンターでスキップ）
3. `src/content/blog/YYYY-MM-DD-タイトル.md` が生成される
4. 生成されたファイルを開いて本文を書く
