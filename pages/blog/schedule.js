import { getPostBySlug } from "lib/api"
import Container from "components/container"
import PostHeader from "components/post-header"
import Image from "next/image"

export default function Schedule({
    title,
    publish,
    content,
    eyecatch,
    categories,
}) {
    return (
        <Container>
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
            </article>
        </Container>
    )
}

export async function getStaticProps() {
    const slug = 'schedule'

    const post = await getPostBySlug(slug)

    return {
        props: {
            title: post.title,
            publish: post.publishDate,
            content: post.content,
            eyecatch: post.eyecatch,
            categories: post.categories,
        },
    }
}