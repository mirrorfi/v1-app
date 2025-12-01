import { Schema, model, models } from 'mongoose';

// ============================================
// Interfaces
// ============================================

export interface IVaultDataMetadata {
  vaultAddr: string;
}

export interface IVaultDataData {
  tokenNav: number;     // Vault valuation in USDC (totalNav / usdPrice)
  usdNav: number;       // Vault valuation in USD
  userDeposits: number; // User deposits adjusted by decimals
}

export interface IVaultData {
  timestamp: Date;
  metadata: IVaultDataMetadata;
  data: IVaultDataData;
}

// ============================================
// Schemas
// ============================================

const vaultDataMetadataSchema = new Schema<IVaultDataMetadata>({
  vaultAddr: { type: String, required: true },
}, { _id: false });

const vaultDataDataSchema = new Schema<IVaultDataData>({
  tokenNav: { type: Number, required: true },
  usdNav: { type: Number, required: true },
  userDeposits: { type: Number, required: true },
}, { _id: false });

const vaultDataSchema = new Schema<IVaultData>({
  timestamp: { type: Date, required: true },
  metadata: { type: vaultDataMetadataSchema, required: true },
  data: { type: vaultDataDataSchema, required: true },
}, {
  // Time-series collections are created by the indexer
  // This schema is for querying only
  collection: undefined, // Will be set per-model
  timestamps: false,     // Time-series uses its own timestamp field
});

// ============================================
// Models
// ============================================

// High-resolution: 5-minute intervals, 7-day TTL
const VaultData5Minute = models.VaultData5Minute || model<IVaultData>(
  'VaultData5Minute', 
  vaultDataSchema, 
  process.env.MONGODB_COLLECTION_5_MINUTE || 'vault_data_5_minute'
);

// Low-resolution: 1-hour intervals, permanent storage
const VaultDataHourly = models.VaultDataHourly || model<IVaultData>(
  'VaultDataHourly', 
  vaultDataSchema, 
  process.env.MONGODB_COLLECTION_HOURLY || 'vault_data_hourly'
);

export { VaultData5Minute, VaultDataHourly };
export default VaultData5Minute;
