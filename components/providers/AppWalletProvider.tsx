"use client";

import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { CLIENT_CONNECTION } from "@/lib/client/solana";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export function AppWalletProvider({ children, }: { children: React.ReactNode; }) {
  const endpoint = CLIENT_CONNECTION.rpcEndpoint;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect onError={() => { }}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}