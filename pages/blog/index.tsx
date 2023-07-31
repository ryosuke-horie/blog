import { getAllPosts } from "lib/api";
import { getQiitaPosts } from "lib/qiita";
import Meta from "components/meta";
import Container from "components/container";
import Hero from "components/hero";
import Posts from "components/posts";
import QiitaPosts from "components/qiita-posts";
import { getPlaiceholder } from "plaiceholder";

// ローカルの代替アイキャッチ画像
import { eyecatchLocal } from "lib/constants";

export default function Blog({ posts, qiitaPosts }) {
  return (
    <Container>
      <Meta pageTitle="ブログ" pageDesc="ブログの記事一覧" />
      <Hero title="Blog" subtitle=''/>
      {/* <Hero title="Blog" subtitle="Recent Posts" /> */}
      <h2>Qiita Posts</h2>
      <QiitaPosts qiitaPosts={qiitaPosts} />
      <h2>Other Blog Posts</h2>
      <Posts posts={posts} />
    </Container>
  );
}

export async function getStaticProps() {
  try {
    const qiitaPosts = await getQiitaPosts(20);
    const posts = await getAllPosts();

    for (const post of posts) {
      if (!post.hasOwnProperty("eyecatch")) {
        post.eyecatch = eyecatchLocal;
      }
      const { base64 } = await getPlaiceholder(post.eyecatch.url);
      post.eyecatch.blurDataURL = base64;
    }

    return {
      props: {
        posts: posts,
        qiitaPosts: qiitaPosts,
      },
      revalidate: 60 * 60 * 24, // 24時間ごとに再生成する
    };
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    return {
      props: {
        posts: [],
        qiitaPosts: [],
      },
    };
  }
}
