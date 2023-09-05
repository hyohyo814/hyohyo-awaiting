import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <ClerkProvider>
      <Head>
        <title>speedpasta</title>
        <meta name="description" content="Make copypasts a muscle memory." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Component key={router.asPath} {...pageProps} />
    </ClerkProvider>
  )
};

export default api.withTRPC(MyApp);
