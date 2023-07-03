import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import { Footer } from "~/components/ui/footer";
import { Header } from "~/components/ui/header";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Pouring at</title>
        <meta
          name="description"
          content="Find your favourite and best beers near you"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </ThemeProvider>
        </div>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
