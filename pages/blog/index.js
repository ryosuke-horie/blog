import Meta from "components/meta"
import Hero from "components/hero"
import Container from "components/container"
import { getAllPosts } from "lib/api"
import Posts from "components/posts"
import { getPlaiceholder } from "plaiceholder"

// ローカルの代替アイキャッチ画像
import { eyecatchLocal } from "lib/constants"

export default function Blog({ posts }) {
  return (
    <Container>
      <Meta pageTitle="Blog" pageDesc="ブログの記事一覧" />
      <Hero title="Blog" subtitle="Recent Posts" />
      <Posts posts={ posts } /> 
    </Container>
  )
}

export async function getStaticProps() {
  const posts = await getAllPosts()

  // アイキャッチ画像がない場合はローカルの画像を表示する
  for (const post of posts) {
    if (!post.hasOwnProperty('eyechatch')) {
      post.eyechatch = eyecatchLocal
    }
    const { base64 } = await getPlaiceholder(post.eyechatch.url)
    post.eyechatch.blurDataURL = base64
  }

  return {
    props: { 
      posts
    },
  }
}