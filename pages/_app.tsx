import { AppProps } from "next/app";
import "./styles.css";
import Script from "next/script";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Tracks pageview with GA4 on route change

      window.gtag("config", "G-5GJ9RMEF7Z", {
        page_path: url,
      });
    };

    // Track the initial pageview
    handleRouteChange(router.asPath);

    // Add event listeners for route changes
    router.events.on("routeChangeComplete", handleRouteChange);

    // Remove event listeners on cleanup
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, router.asPath]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
      </Head>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-5GJ9RMEF7Z"
      ></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5GJ9RMEF7Z');
        `,
        }}
      />

      <Component {...pageProps} />
    </>
  );
}
