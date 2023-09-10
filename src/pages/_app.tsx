import "../assets/style/global.scss";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import GeneralLayout from "@/components/generalLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return <GeneralLayout>
    <Component {...pageProps} />
  </GeneralLayout>;
}

export default wrapper.withRedux(MyApp);