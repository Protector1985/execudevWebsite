import { AppProps } from "next/app";
import "./styles.css";
import Footer from "@/components/Footer/Footer";
import ReactGA from 'react-ga';
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  
  const router = useRouter();

  const trackingId = process.env.NEXT_GOOGLE_TRACKING_ID;
    if (typeof trackingId === 'string') {
      ReactGA.initialize(trackingId);
    }
  
  useEffect(() => {
    // Initialize Google Analytics
    

    const handleRouteChange = (url:string) => {
      ReactGA.set({ page: url });
      ReactGA.pageview(url);
    };

    // Track the initial pageview
    handleRouteChange(router.asPath);

    // Add event listeners for route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    // Remove event listeners on cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, router.asPath]);

  return <Component {...pageProps} />;
};

