---
name: design-guidelines
description: このプロジェクトのUIコンポーネント実装ガイドライン。アイコン、アコーディオン、スタイリングについて実装する際に参照。
user-invocable: true
---

# デザインガイドライン

このプロジェクトで使用するデザインパターンと実装ルール。

## アイコンの実装ルール

### 原則: CSS Borderで描画する

Unicode文字（▶、▼など）やSVGの代わりに、CSSのborder trickを使用してアイコンを描画する。

**理由**:
- フォントに依存しない（環境によって絵文字風に表示される問題を回避）
- ファイルサイズが小さい
- `currentColor`でテキスト色に連動
- スムーズなアニメーションが可能

### アコーディオン開閉アイコン

**パターン**: `▶` → `▼`（右向き→下向き）が一般的

- macOS Finder、VS Code等で広く使われるパターン
- 「展開方向」を示す（下に開くから下向き）

**CSS実装**:

```css
/* 閉じている時: 右向き三角形 */
.accordion-icon::before {
    content: "";
    display: inline-block;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid currentColor;
    transition: transform 0.2s ease;
}

/* 開いている時: 90度回転して下向き */
.accordion[open] > .accordion-icon::before {
    transform: rotate(90deg);
}
```

### その他のCSS Border アイコン例

**下向き三角形**:
```css
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-top: 6px solid currentColor;
```

**チェックマーク**:
```css
width: 0.5em;
height: 0.25em;
border-left: 2px solid currentColor;
border-bottom: 2px solid currentColor;
transform: rotate(-45deg);
```

## スタイリング原則

- **ブレークポイント**: 720px以下でモバイル表示
- **画像サイズ**: ブログ記事内は最大幅80%、中央揃え
- **アニメーション**: `transition: 0.2s ease` を基本とする
- **色の継承**: `currentColor`を使用してテキスト色に連動させる
