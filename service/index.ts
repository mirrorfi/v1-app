import dotenv from "dotenv";
import { VaultIndexer } from "./utils/vaultIndexer";

dotenv.config();


async function runVaultIndexer(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not defined");
    return;
  }

  const indexer = new VaultIndexer(mongoUri);
  await indexer.initialize();

  // This runs forever
  await indexer.startIndexing();

  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await indexer.close();
    process.exit(0);
  });
}

// Start the service
runVaultIndexer().catch(error => {
  console.error('Failed to start vault indexing service:', error);
  process.exit(1);
});