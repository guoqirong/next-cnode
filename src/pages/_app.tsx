import "../assets/style/global.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { wrapper } from "../store/store";
import GeneralLayout from "@/components/generalLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 获取本地登录态
    dispatch({
      type: 'user/updateToken',
      payload: localStorage.getItem('token') || '',
    });
    dispatch({
      type: 'user/updateSimpleUserData',
      payload: {loginname: localStorage.getItem('loginname') || ''},
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return  <>
    <Head>
      <title>next-cnode</title>
      <script async src="https://cdn.tiny.cloud/1/mh2f2ffdlr2zzaky3yk52tx8rtxrxnbt1a6p7p7jx96hy70r/tinymce/5/tinymce.min.js" referrerPolicy="origin"></script>
    </Head>
    <GeneralLayout>
      <Component {...pageProps} />
    </GeneralLayout>
  
  </>;
}

export default wrapper.withRedux(MyApp);