import styles from 'styles/posts.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function Posts({ posts }) {
    return (
        <div className={styles.gridContainer}>
            {posts.map(({ title, slug, eyechatch }) => (
                <article className={styles.post} key={slug}>
                    <Link href={`/blog/${slug}`}>
                        <figure>
                            <Image
                                src={eyechatch.url}
                                alt=""
                                layout="responsive"
                                width={eyechatch.width}
                                height={eyechatch.height}
                                sizes="(max-width: 1152px) 576px, 50vw"
                                placeholder='blur'
                                blurDataURL={eyechatch.blurDataURL}
                            />
                        </figure>
                        <h2>{title}</h2>
                    </Link>
                </article>
            ))}
        </div>
    )
}