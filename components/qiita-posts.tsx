import styles from "styles/qiita-posts.module.css";
import Link from "next/link";
import ConvertDate from "./convert-date";

export default function QiitaPosts({ qiitaPosts }) {
  return (
    <div className={styles.gridContainer}>
      {qiitaPosts.map(({ title, url, updated_at }) => (
        <article className={styles.post} key={title}>
          <Link target="_blank" href={url}>
            <h2>{title}</h2>
            <p>
              最終更新日：<ConvertDate dateISO={updated_at} />
            </p>
          </Link>
        </article>
      ))}
    </div>
  );
}
