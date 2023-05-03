import Link from "next/link"
import styles from "styles/nav.module.css"

export default function Nav() {
    return (
        <nav>
            <ul className={styles.list}>
                <li>
                    <Link href="/">
                        HOME
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        ABOUT
                    </Link>
                </li>
                <li>
                    <Link href="/blog">
                        BLOG
                    </Link>
                </li>
            </ul>
        </nav>
    )
}