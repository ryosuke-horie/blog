import { getAllPosts } from "lib/api"
import { getQiitaPosts } from "lib/qiita"
import Meta from "components/meta"
import Hero from "components/hero"
import Container from "components/container"
import Posts from "components/posts"
import QiitaPosts from "components/qiita-posts"
import Pagination from "components/pagination"
import { getPlaiceholder } from "plaiceholder"

// ローカルのデフォルトアイキャッチ画像
import { eyecatchLocal } from "lib/constants"

export default function Home({ posts, qiitaPosts }) {
  return (
    <Container>
      <Meta />
      <Hero title="TECH" subtitle="For output tech" imageOn />
      <h2>Recent Qiita Posts</h2>
      <QiitaPosts qiitaPosts={qiitaPosts} />
      <h2>Recent Other Blog Posts</h2>
      <Posts posts={posts} />
      <Pagination nextUrl="/blog" nextText="More Posts" />
    </Container>
  )
}

export async function getStaticProps() {
  try {
    // Qiitaの記事を取得
    const qiitaPosts = await getQiitaPosts()

    // microCMSの記事を取得
    const posts = await getAllPosts(4)
    for (const post of posts) {
      if (!post.hasOwnProperty('eyecatch')) {
        post.eyecatch = eyecatchLocal
      }
      const { base64 } = await getPlaiceholder(post.eyecatch.url)
      post.eyecatch.blurDataURL = base64
    }

    return {
      props: {
        posts: posts,
        qiitaPosts: qiitaPosts,
      },
    }
  } catch (error) {
    console.error('データの取得中にエラーが発生しました:', error);
    return {
      props: {
        posts: [],
        qiitaPosts: [],
      },
    };
  }
}