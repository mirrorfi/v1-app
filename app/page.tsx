"use client";
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic'; 
import { useEffect, useState } from "react";
import { StrategyModal } from '@/components/StrategyModal';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
 
export default function Home() {
  const [modalOpen, setModalOpen] = useState(true);
  let closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background/95 to-blue-950/20 text-foreground overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        {/*<StrategyDashboardHeader
            strategies={strategies}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {viewMode === "grid" ? (
            <StrategyGridView
              strategies={strategies}
              categoryFilter={categoryFilter}
              onStrategyClick={handleStrategyClick}
            />
          ) : (
            <StrategyListView
              strategies={strategies}
              categoryFilter={categoryFilter}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              onStrategyClick={handleStrategyClick}
            />
          )}*/}
        <StrategyModal
          isOpen={modalOpen}
          onClose={closeModal}
        />
      </main>
    </div>
  );
}