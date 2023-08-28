import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>DevChat</title>
        <meta
          name="description"
          content="A LLaMA2 chat client made just for fun"
        />
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center gap-12 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black text-white">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
