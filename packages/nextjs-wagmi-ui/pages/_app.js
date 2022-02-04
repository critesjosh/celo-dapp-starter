import "../styles/globals.css";
import { providers } from "ethers";
import { DAppProvider, useEtherBalance, useEthers, Config } from '@usedapp/core'
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

const config = {
  readOnlyChainId: 44787,
  readOnlyUrls: {
    44787: 'https://alfajores-forno.celo-testnet.org',
  },
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Celo DApp Starter</title>
        <meta name="description" content="Celo DApp Starter" />
      </Head>
      <DAppProvider config={config}>
          <div suppressHydrationWarning>
            {typeof window === "undefined" ? null : (
              <Component {...pageProps} />
            )}
          </div>
      </DAppProvider>
    </>
  );
}

export default MyApp;
