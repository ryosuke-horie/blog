import Meta from "components/meta"
import Hero from "components/hero"
import Container from "components/container"

export default function Blog() {
  return (
    <Container>
      <Meta pageTitle="Blog" />
      <Hero title="Blog" subtitle="Recent Posts" />
    </Container>
  )
}
