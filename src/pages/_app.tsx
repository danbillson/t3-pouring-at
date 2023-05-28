import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/space-mono";
import { type AppType } from "next/app";
import Head from "next/head";
import { Header } from "~/components/header";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Fresh on Tap</title>
        <meta
          name="description"
          content="Find your favourite and best beers near you"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Header />
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
