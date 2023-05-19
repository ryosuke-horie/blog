import Meta from "components/meta";
import Container from "components/container";
import Hero from "components/hero";
import PostBody from "components/post-body";
import Contact from "components/contact";
import {
  TwoColumn,
  TwoColumnMain,
  TwoColumnSidebar,
} from "components/two-column";
import Accordion from "components/accordion";
import Image from "next/image";
import eyecatch from "images/about.jpg";

export default function About() {
  return (
    <Container>
      <Meta
        pageTitle="アバウト"
        pageDesc="About development activities"
        pageImg={eyecatch.src}
        pageImgW={eyecatch.width}
        pageImgH={eyecatch.height}
      />

      <Hero title="About" subtitle="About development activities" />

      <figure>
        <Image
          src={eyecatch}
          alt=""
          layout="responsive"
          sizes="(min-width: 1152px) 1152px, 100vw"
          priority
          placeholder="blur"
        />
      </figure>

      <TwoColumn>
        <TwoColumnMain>
          <PostBody>
            <p>
              このブログでは、自分自身のアウトプットの記録や、技術記事の掲載、日々の学びを記録しています。ここでは私個人についてまとめさせていただきます。
            </p>
            <h2>私について</h2>
            <p>
              PHP(Laravel)をメインの言語としてサーバーサイドエンジニアとして働いています。
              <br />
              生成系AIの登場によって技術の学習のハードルが下がったことをきっかけに、フルスタックなエンジニアになりたいと思い、AWSをメインにインフラ系の学習やReact,Next.jsを採用したフロントエンド技術を学習しています。
            </p>
            <p>
              学習スタイルとして、ハードルの低い教材から始め、簡単なアプリケーションを開発し、その後記事としてアウトプットするようにしています。
              Qiitaよりも気軽にアウトプットする機会を増やすために、このブログを開発しました。
            </p>
            <h3>技術スタック</h3>
            <table>
              <tr>
                <th>フロントエンド</th>
                <td>JavaScript, Typescrit, React, Next.js, CSS</td>
              </tr>
              <tr>
                <th>バックエンド</th>
                <td>PHP, Laravel, CakePHP, Python, Typescript</td>
              </tr>
              <tr>
                <th>インフラ(クラウド)</th>
                <td>AWS</td>
              </tr>
              <tr>
                <th>保有資格</th>
                <td>AWS CLF, SAA認定</td>
              </tr>
            </table>

            <h2>FAQ</h2>
            <Accordion heading="注力していること">
              <p>
                フルスタックにふるまっていけるようにクラウド技術の習得に力を入れています。AWS
                SAP認定試験の学習と、実際に個人サービスの構築をして学習に力を入れています。
              </p>
            </Accordion>
            <Accordion heading="キャリアのビジョンについて">
              <p>
                テックリードとして、チームの技術的な方向性を決めていけるようなエンジニアになりたいと思っています。
                そのためにインフラからフロントエンドまでの網羅的な知識を習得しつつ、技術の基盤となるサーバー寄りの知見に専門性を持っていきたいと考えています。
              </p>
            </Accordion>
          </PostBody>
        </TwoColumnMain>

        <TwoColumnSidebar>
          <Contact />
        </TwoColumnSidebar>
      </TwoColumn>
    </Container>
  );
}
