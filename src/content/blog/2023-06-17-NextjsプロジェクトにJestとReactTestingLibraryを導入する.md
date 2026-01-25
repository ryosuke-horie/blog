---
title: Next.js(13.4.1)のプロジェクトにJest+React Testing Libraryを導入してテストを実装する準備
pubDate: 2023-06-17
description: 'Next.js 13.4.1でJestとReact Testing Libraryを導入する手順。'
---

## Jest＋React Testing Library導入

### インストールコマンド

以下のパッケージをインストールします：

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

### 設定ファイル作成

プロジェクトルートに`jest.config.mjs`を作成し、以下の設定を追加します：

```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(config)
```

### npm scriptの追加

`package.json`のscriptセクションに以下を追加：

```json
"test": "jest --watch"
```

### 動作確認

プロジェクトルートに`__tests__`ディレクトリを作成し、`page.test.tsx`ファイルを追加：

```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../src/app/page'

describe('Home', () => {
  it('Topページのタイトル確認', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
      name: "H1タイトル",
    })
    expect(heading).toBeInTheDocument()
  })
})
```

`npm run test`を実行してテストが成功することを確認します。
