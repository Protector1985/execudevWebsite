import { AppProps } from "next/app";
import "./styles.css";
import Footer from "@/components/Footer/Footer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    //header
      <Component {...pageProps} />
    //footer
  );
}
