import "../styles/globals.css";
import { Provider, Connector } from "wagmi";
import { getNetwork, JsonRpcProvider } from "@ethersproject/providers";
import { Celo, Alfajores, Localhost } from "../utils/constants.ts";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import Container from "@mui/material/Container";

const rpcMap = {
  44787: "https://alfajores-forno.celo-testnet.org",
  42220: "https://forno.celo.org",
};

const chains = [Celo, Alfajores, Localhost];
const defaultChain = Alfajores;

const connectors = ({ chainId }) => {
  const network = getNetwork(chainId ?? defaultChain.id);

  const rpcUrl = rpcMap[network.chainId];
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          44787: "https://alfajores-forno.celo-testnet.org",
          42220: "https://forno.celo.org",
        },
      },
    }),
  ];
};

const provider = ({ chainId }) => {
  const network = getNetwork(chainId ?? defaultChain.id);
  const rpcUrl = rpcMap[network.chainId];
  return new JsonRpcProvider(rpcUrl)
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Celo DApp Starter</title>
        <meta name="description" content="Celo DApp Starter" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Provider connectors={connectors}>
        <ApolloProvider client={client}>
          <div suppressHydrationWarning>
            {typeof window === "undefined" ? null : (
              <Component {...pageProps} />
            )}
          </div>
        </ApolloProvider>
      </Provider>
    </>
  );
}

export default MyApp;
