---
title: Progressive Disclosureとclaude code
pubDate: 2026-02-05
---

うっすらとそのような概念があることは知っていたのだが...

[https://tech.bm-sms.co.jp/entry/2026/02/04/110000](https://tech.bm-sms.co.jp/entry/2026/02/04/110000)

この記事を読んでいて、Progressive Disclosureという名前の考え方だと知った。
会社でclaude codeの利用を推進する立場を取っており、skillsやsub agent周りの整備を実際にプロジェクトで行っているため、自分の言葉でまとめられるように調べていく。


# Progressive Disclosureとは

claude codeにおいては以下のように1つのスキルを内部で分割し、必要に応じて読み込ませるようにするパターン。
```
pdf/
├── SKILL.md              # Main instructions (loaded when triggered)
├── FORMS.md              # Form-filling guide (loaded as needed)
├── reference.md          # API reference (loaded as needed)
├── examples.md           # Usage examples (loaded as needed)
└── scripts/
    ├── analyze_form.py   # Utility script (executed, not loaded)
    ├── fill_form.py      # Form filling script
    └── validate.py       # Validation script
```

具体的には...
1つのスキルを成長させていき、500行を超えたところを目安に必要な時に必要なものを読み込める状態を目指していく。
SKILL.mdが目次のように機能してくれるように記述するのが良さそう。


## SKILL.mdの仕様

[https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

こちらを読んでいてSKILLの概念はclaude codeのチューニングに与える影響が大きい割に自分が詳細を理解していないことに気がついた。
体感的にはSKILLの作り込みは大事だと思っているが、実際に書く時にはclaude codeのビルトインの claude-code-guideサブエージェントにお任せしてしまい、内部のコツを掴まずにいた。
この機会に読み直す。


### 気になった内容の抜粋

* 使用する予定のモデルに応じて、説明の詳細度を変える
    * haikuでは詳細に、opusでは簡潔に
* 命名には動名詞が推奨される
* フロントマターのdescriptionは3人称視点でキーワードを含める。トリガーとして利用する。
* claude codeの起動時にフロントマター部分をシステムプロンプトに読み込まれる。
