import { getPostBySlug } from "lib/api"
import { extractText } from "lib/extract-text"
import Meta from "components/meta"
import Container from "components/container"
import PostHeader from "components/post-header"
import PostCategories from "components/post-categories"
import PostBody from "components/post-body"
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from "components/two-columln"
import ConvertBody from "components/convert-body"
import Image from "next/image"
// ローカルの代替アイキャッチ画像
import { eyecatchLocal } from "lib/constants"

export default function Schedule({
    title,
    publish,
    content,
    eyecatch,
    categories,
    description,
}) {
    return (
        <Container>
            <Meta
                pageTitle={title}
                pageDesc={description}
                pageImg={eyecatch.url}
                pageImgW={eyecatch.width}
                pageImgH={eyecatch.height}
            />

            <article>
                <PostHeader title={title} subtitle="Blog Articles" publish={publish} />

                <figure>
                    <Image
                        src={eyecatch.url}
                        alt=""
                        layout="responsive"
                        height={eyecatch.height}
                        width={eyecatch.width}
                        sizes="(min-width: 1152px) 1152px, 100vw"
                        priority
                    />
                </figure>

                <TwoColumn>
                    <TwoColumnMain>
                        <PostBody>
                            <ConvertBody contentHTML={content} />
                        </PostBody>
                    </TwoColumnMain>
                    <TwoColumnSidebar>
                        <PostCategories categories={categories} />
                    </TwoColumnSidebar>
                </TwoColumn>
            </article>
        </Container>
    )
}

export async function getStaticProps() {
    const slug = 'micro'

    const post = await getPostBySlug(slug)

    const description = extractText(post.content)

    const eyecatch = post.eyecatch ?? eyecatchLocal

    return {
        props: {
            title: post.title,
            publish: post.publishDate,
            content: post.content,
            eyecatch: eyecatch,
            categories: post.categories,
            description: description,
        },
    }
}