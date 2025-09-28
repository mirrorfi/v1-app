import { MongoClient } from "mongodb";
import axios from "axios";
import { PriceData, LogType } from "../types/index";
import Logger from "./logger";
import { FETCH_INTERVAL, LOG_FILE_NAME } from "../config.json";
const {
  INFO,
  SUCCESS,
  WARNING,
  ERROR
} = LogType;
import sampleVaultData from "../data/sample-data";

// Your vault addresses
const hardCodedSampleVaultAddresses = [
  "H1ZpCkCHJR9HxwLQSGYdCDt7pkqJAuZx5FhLHzWHdiEw"
];


export class VaultIndexer {
  private client: MongoClient;
  private logger: Logger;
  private fetchCount = 0;
  private successCount = 0;
  private errorCount = 0;
  private intervalMs: number = FETCH_INTERVAL;

  private MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;
  private MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;
  private MIRRORFI_API_URL = process.env.MIRRORFI_API_URL;

  private vaults: string[] = [];


  constructor(mongoUri: string) {
    this.client = new MongoClient(mongoUri);
    this.logger = new Logger({ logFileName: LOG_FILE_NAME });
  }



  async initialize(): Promise<void> {
    try {
      await this.client.connect();
      const db = this.client.db(this.MONGODB_DB_NAME);

      // Create simple time-series collection for vault data
      try {
        await db.createCollection("vault_snapshots", {
          timeseries: {
            timeField: "timestamp",
            metaField: "metadata",
            granularity: "minutes"
          }
        });
        this.logger.log(SUCCESS, "Vault snapshots collection created");
      } catch (error: any) {
        if (error.code === 48) {
          this.logger.log(INFO, "Vault snapshots collection already exists");
        } else {
          throw error;
        }
      }

      this.logger.log(SUCCESS, "VaultIndexer initialized");
    } catch (error) {
      this.logger.log(ERROR, "Failed to initialize VaultIndexer", error);
      throw error;
    }

    // Load initial vault list
    this.vaults = await this.getAllVaults();
    if (!this.vaults || this.vaults.length === 0) {
      this.logger.log(WARNING, "No vaults found to index");
      this.vaults = [];
    } else {
      this.logger.log(INFO, `Loaded ${this.vaults.length} vaults to index`);
    }
  }

  async indexVaults(): Promise<void> {
    this.fetchCount++;
    const startTime = Date.now();
    const timestamp = new Date();

    this.logger.log(INFO, `Fetch #${this.fetchCount} - Fetching vault data for ${this.vaults.length} vaults...`);

    try {
      const db = this.client.db(this.MONGODB_DB_NAME);
      let processedVaults = 0;

      // Process each vault individually
      for (const vaultAddress of this.vaults) {
        try {
          // Fetch vault balance data
          const vaultData = await this.getVaultBalance(vaultAddress);

          if (!vaultData) {
            this.logger.log(WARNING, `No vault data received for ${vaultAddress}`);
            continue;
          }

          // Create time-series document for this vault
          const document = {
            timestamp,
            metadata: {
              source: "mirrorfi-api",
              vaultAddress: vaultAddress,
              spotTokenCount: vaultData.spot?.tokens?.length || 0,
              kaminoObligationCount: vaultData.kamino?.length || 0
            },
            data: vaultData // The entire vault balance data goes here
          };

          // Save to vault_snapshots collection
          await db.collection('vault_snapshots').insertOne(document);
          processedVaults++;

          // Log vault summary
          const spotNAV = vaultData.spot?.totalNAV || 0;
          const kaminoNAV = vaultData.kamino?.reduce((sum: number, obligation: any) => sum + (obligation.totalNAV || 0), 0) || 0;
          const totalNAV = spotNAV + kaminoNAV;

          this.logger.log(INFO, 
            `🏦 ${vaultAddress.slice(0, 8)}... - Total NAV: $${totalNAV.toFixed(4)} (Spot: $${spotNAV.toFixed(4)}, Kamino: $${kaminoNAV.toFixed(4)})`
          );

        } catch (vaultError: any) {
          this.logger.log(ERROR, `Failed to process vault ${vaultAddress}`, {
            error: vaultError.message
          });
        }
      }

      const duration = Date.now() - startTime;
      this.successCount++;

      this.logger.log(SUCCESS, 
        `Vault #${this.fetchCount} - Processed ${processedVaults}/${this.vaults.length} vaults in ${duration}ms`
      );

      // Log summary every 15 successful saves
      if (this.successCount % 15 === 0) {
        const totalDocs = await db.collection('vault_snapshots').countDocuments();
        
        this.logger.log(INFO, 
          `Summary - Total fetches: ${this.fetchCount} | Success: ${this.successCount} | ` +
          `Errors: ${this.errorCount} | Total snapshots: ${totalDocs}`
        );
      }

    } catch (error: any) {
      this.errorCount++;
      const duration = Date.now() - startTime;
      
      this.logger.log(ERROR, `Fetch #${this.fetchCount} failed after ${duration}ms`, {
        error: error.message,
        code: error.code,
        status: error.response?.status
      });
    }
  }

  async getAllVaults(): Promise<string[]> {
    return hardCodedSampleVaultAddresses;
    try {
        // fetch from sample endpoint
        async () => {
            console.log("Fetching vault list...");
            const response = await axios.get(
                `${this.MIRRORFI_API_URL}/vaults/list`,
                {
                    headers: { 'Accept': 'application/json' },
                    timeout: 10000
                }
            );

            if (!response?.data) {
                this.logger.log(WARNING, "No vault list data received");
                return;
            }

            const vaults: string[] = response.data.vaults || [];
            console.log(`Fetched ${vaults.length} vaults`);
            return vaults;
        }
    } catch (error) {
        this.logger.log(ERROR, "Failed to fetch vault list", error);
    }
  }

  async getVaultBalance(vaultAddress: string): Promise<any> {
    
    return sampleVaultData;

    // Add implementation when API is available
  }

  async startIndexing(): Promise<void> {
    this.logger.log(INFO, 
      `🔄 Starting vault indexing (every ${this.intervalMs/1000}s)`
    );

    setInterval(async () => {
      await this.indexVaults();
    }, this.intervalMs);
  }

  async close(): Promise<void> {
    await this.client.close();
    this.logger.log(INFO, "VaultIndexer closed");
  }
}