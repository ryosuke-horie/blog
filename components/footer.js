import Logo from "components/logo"
import styles from "styles/footer.module.css"
import Social from "components/social"
import Container from "components/container"

export default function Footer() {
    return (
        <Container>
            <footer className={styles.wrapper}>
                <div className={styles.flexContainer}>
                    <Logo />
                    <Social />
                </div>
            </footer>
        </Container>
    )
}