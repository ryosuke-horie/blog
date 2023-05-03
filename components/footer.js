import Logo from "components/logo"
import styles from "styles/footer.module.css"
import Container from "components/container"

export default function Footer() {
    return (
        <Container>
            <footer className={styles.wrapper}>
                <div className={styles.flexContainer}>
                    <Logo />
                    [ソーシャル]
                </div>
            </footer>
        </Container>
    )
}