import { createInterface } from 'node:readline';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function getFormattedDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getISODate() {
  return new Date().toISOString();
}

async function main() {
  const title = await question('? 記事のタイトルを入力してください: ');

  if (!title.trim()) {
    console.error('\n✗ タイトルを入力してください');
    rl.close();
    process.exit(1);
  }

  const date = getFormattedDate();
  const filename = `${date}-${title.trim()}.md`;
  const filepath = join(process.cwd(), 'src', 'content', 'blog', filename);

  const frontmatter = `---
title: ${title.trim()}
pubDate: ${getISODate()}
---

`;

  writeFileSync(filepath, frontmatter, 'utf-8');
  console.log(`\n✓ 作成しました: src/content/blog/${filename}`);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
