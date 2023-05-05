import styles from 'styles/posts.module.css'
import Link from 'next/link'

export default function Posts({ posts }) {
    return (
        <div className={styles.gridContainer}>
            {posts.map(({ title, slug }) => (
                <article className={styles.post} key={slug}>
                    <Link href={`/blog/${slug}`}>
                        <h2>{title}</h2>
                    </Link>
                </article>
            ))}
        </div>
    )
}