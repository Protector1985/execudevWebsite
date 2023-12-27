import { AppProps } from "next/app";
import "./styles.css";
import { PositionProvider } from "@/context/PositionContext";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    //header
  
      <Component {...pageProps} />
   
    //footer
  );
}
