"use client";

import dynamic from 'next/dynamic'; 
import { Navbar } from "@/components/Navbar";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
 
export default function Home() {
  return (
     <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/95 to-blue-950/20 text-foreground">
        <Navbar />
     </div>
  );
}