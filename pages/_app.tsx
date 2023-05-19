import "styles/globals.css";
import Layout from "components/layout";

// Font Awesomeの設定
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Font AwesomeのSVGコアが個別にCSSを適用するのを無効化

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-5FL38R0Z4R"
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5FL38R0Z4R', { page_path: window.location.pathname });
            `,
        }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap"
        rel="stylesheet"
      />
      <Component {...pageProps} />
    </Layout>
  );
}
