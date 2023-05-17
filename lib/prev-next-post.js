export function prevNextPost(allSlugs, currentSlug) {
  // 記事の総数を取得
  const numberOfPosts = allSlugs.length;

  const index = allSlugs.findIndex(({ slug }) => slug === currentSlug);

  // 前の記事のデータをprevPostに格納
  // 現在の記事が最後の記事ならtitleとslugを空にしてセットする
  const prevPost =
    index + 1 === numberOfPosts ? { tilte: "", slug: "" } : allSlugs[index + 1];

  // 次の記事のデータをnextPostに格納
  // 現在の記事が配列の最初の記事ならtitleとslugを空にしてセットする
  const nextPost = index === 0 ? { title: "", slug: "" } : allSlugs[index - 1];

  return [prevPost, nextPost];
}
